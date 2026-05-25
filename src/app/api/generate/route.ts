import { NextResponse } from "next/server";

type RelayResponse = {
  topic?: string;
  vocabulary?: Array<{ word?: string; definition?: string; emojis?: string; explanation?: string }>;
};

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

type ChatCompletionPayload = Record<string, unknown>;

function extractTextFromChatCompletionsPayload(payload: ChatCompletionPayload): string | null {
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
      const trimmed = value.trim();
      if (!trimmed) return null;
      if (trimmed.startsWith("{") || trimmed.startsWith("[")) return trimmed;
      return null;
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

    const record = value as Record<string, unknown>;
    for (const key of ["text", "content", "message", "output_text", "response", "output", "choices"]) {
      const found = walk(record[key]);
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

    const payload = await res.json().catch(() => ({}));

    if (!res.ok) {
      const requestId =
        payload?.error?.request_id ||
        payload?.request_id ||
        payload?.error?.message?.match(/request id:\s*([^\)]+)/i)?.[1] ||
        "unknown";
      const message = payload?.error?.message || payload?.message || "Upstream error";
      return NextResponse.json({ error: `${message} (request id: ${requestId})` }, { status: res.status });
    }

    const rawText = extractTextFromChatCompletionsPayload(payload);
    if (!rawText) {
      return NextResponse.json({ error: "No model response text in relay payload." }, { status: 502 });
    }

    let parsed: RelayResponse;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      const fenced = rawText.match(/\{[\s\S]*\}/);
      if (!fenced) return NextResponse.json({ error: "Model response is not valid JSON." }, { status: 502 });
      parsed = JSON.parse(fenced[0]) as RelayResponse;
    }

    const normalized = normalizeParsed(topic, words, parsed);
    return NextResponse.json(normalized);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unexpected server error";
    const status = /rate|quota/i.test(msg) ? 429 : /timeout/i.test(msg) ? 504 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
