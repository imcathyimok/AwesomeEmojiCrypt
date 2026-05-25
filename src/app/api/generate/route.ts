import { NextResponse } from "next/server";

type RelayResponse = {
  topic?: string;
  vocabulary?: Array<{ word?: string; definition?: string; emojis?: string; explanation?: string }>;
};

type ChatCompletionPayload = Record<string, unknown>;

const systemPrompt = `You are EmojiCrypt, an AI that creates memorable emoji associations for vocabulary learning. Your purpose is to help students remember words by creating visual, emoji-based mnemonics that reveal the "meaning beneath the surface."

Given a topic and a list of vocabulary words, generate emoji sequences, definitions, and explanations for each word.

Output must be a JSON object with this structure:
{
  "topic": "string",
  "vocabulary": [
    {
      "word": "string",
      "definition": "concise, 1-2 sentences",
      "emojis": "3-5 emojis as a single string",
      "explanation": "step-by-step connection between emojis and the word"
    }
  ]
}

Emoji guidelines:
- Use 3-5 emojis per word.
- Create a mini-story or visual metaphor.
- Mix literal, symbolic, phonetic, and conceptual cues.
- Make it challenging but solvable.
- Always include an explanation.

Rules:
- No offensive emojis.
- Accurate academic definitions.
- Student-friendly tone.
- For abstract words, use more symbolic emojis and explain the metaphor.`;

function normalizeParsed(topic: string, words: string[], parsed: RelayResponse) {
  const vocab = Array.isArray(parsed.vocabulary) ? parsed.vocabulary : [];
  return {
    topic: parsed.topic || topic,
    vocabulary: words.map((fallbackWord, i) => {
      const item = vocab[i] ?? {};
      return {
        word: item.word?.trim() || fallbackWord,
        definition: item.definition?.trim() || "Definition not available",
        emojis: item.emojis?.trim() || "🤷",
        explanation: item.explanation?.trim() || "No explanation provided",
      };
    }),
  };
}

async function callRelayChatCompletions(
  apiUrl: string,
  apiKey: string,
  model: string,
  userPrompt: string,
  authMode: "bearer" | "x-api-key",
) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (authMode === "bearer") headers.Authorization = `Bearer ${apiKey}`;
  else headers["x-api-key"] = apiKey;

  return fetch(apiUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `${userPrompt}\n\nReturn JSON only.` },
      ],
    }),
  });
}

function safeJsonParse(text: string): ChatCompletionPayload | null {
  try {
    return JSON.parse(text) as ChatCompletionPayload;
  } catch {
    return null;
  }
}

function extractFirstJsonObject(text: string): RelayResponse | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]) as RelayResponse;
  } catch {
    return null;
  }
}

function extractTextFromPayload(payload: ChatCompletionPayload): string | null {
  const candidates: unknown[] = [
    payload.text,
    payload.output_text,
    payload.message,
    payload.content,
    payload.response,
    payload.output,
    payload.choices,
  ];

  const visited = new Set<unknown>();

  const walk = (value: unknown): string | null => {
    if (value == null || visited.has(value)) return null;

    if (typeof value === "string") {
      const t = value.trim();
      if (!t) return null;
      return t;
    }

    if (typeof value !== "object") return null;
    visited.add(value);

    if (Array.isArray(value)) {
      for (const item of value) {
        const found = walk(item);
        if (found) return found;
      }
      return null;
    }

    const obj = value as Record<string, unknown>;
    for (const key of ["text", "content", "message", "output_text", "response", "output", "choices", "delta"]) {
      const found = walk(obj[key]);
      if (found) return found;
    }

    return null;
  };

  for (const candidate of candidates) {
    const found = walk(candidate);
    if (found) return found;
  }

  return null;
}

function getUpstreamError(payload: ChatCompletionPayload | null, rawText: string, status: number): string {
  if (payload) {
    const err = payload.error as Record<string, unknown> | undefined;
    const errMsg = typeof err?.message === "string" ? err.message : null;
    const topMsg = typeof payload.message === "string" ? payload.message : null;
    const reqId =
      (typeof err?.request_id === "string" && err.request_id) ||
      (typeof payload.request_id === "string" && payload.request_id) ||
      "unknown";

    if (errMsg || topMsg) {
      return `${errMsg ?? topMsg} (status: ${status}, request id: ${reqId})`;
    }
  }

  return `Upstream error (status: ${status}). Raw: ${rawText.slice(0, 500)}`;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.YINLI_API_KEY;
    const apiUrl = process.env.YINLI_API_URL;
    const model = process.env.YINLI_MODEL;

    if (!apiKey || !apiUrl || !model) {
      return NextResponse.json({ error: "Server is missing YINLI_API_KEY / YINLI_API_URL / YINLI_MODEL." }, { status: 500 });
    }

    const body = (await req.json()) as { topic?: string; words?: string[] };
    const topic = body.topic?.trim() || "General Vocabulary";
    const words = (body.words || []).map((w) => w.trim()).filter(Boolean);

    if (words.length < 3 || words.length > 50) {
      return NextResponse.json({ error: "Words must be between 3 and 50." }, { status: 400 });
    }

    const userPrompt = `Generate a vocabulary flashcard set for the topic "${topic}". Words: ${words.join(", ")}.`;

    let res = await callRelayChatCompletions(apiUrl, apiKey, model, userPrompt, "bearer");
    if (!res.ok && (res.status === 401 || res.status === 403)) {
      res = await callRelayChatCompletions(apiUrl, apiKey, model, userPrompt, "x-api-key");
    }

    const rawText = await res.text();
    const payload = safeJsonParse(rawText);

    if (!res.ok) {
      return NextResponse.json({ error: getUpstreamError(payload, rawText, res.status) }, { status: res.status });
    }

    const extractedText = payload ? extractTextFromPayload(payload) : null;

    let parsed: RelayResponse | null = null;

    if (extractedText) {
      parsed = safeJsonParse(extractedText) as RelayResponse | null;
      if (!parsed) parsed = extractFirstJsonObject(extractedText);
    }

    if (!parsed && payload) {
      parsed = payload as unknown as RelayResponse;
    }

    if (!parsed) {
      return NextResponse.json(
        {
          error: "No model response text in relay payload.",
          debug: {
            upstreamStatus: res.status,
            snippet: rawText.slice(0, 600),
          },
        },
        { status: 502 },
      );
    }

    const normalized = normalizeParsed(topic, words, parsed);
    return NextResponse.json(normalized);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unexpected server error";
    const status = /rate|quota/i.test(msg) ? 429 : /timeout/i.test(msg) ? 504 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
