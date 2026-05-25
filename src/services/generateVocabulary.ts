import { v4 as uuid } from "uuid";
import type { GenerateApiResponse, RawVocabularyItem, Session, VocabWord } from "@/types";
import { GenerationError } from "@/types";

const FALLBACKS = {
  emojis: "🤷",
  definition: "Definition not available",
  explanation: "No explanation provided",
};

function asNonEmptyString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeItem(item: RawVocabularyItem, fallbackWord: string): VocabWord {
  return {
    word: asNonEmptyString(item.word) ?? fallbackWord,
    definition: asNonEmptyString(item.definition) ?? FALLBACKS.definition,
    emojis: asNonEmptyString(item.emojis) ?? FALLBACKS.emojis,
    explanation: asNonEmptyString(item.explanation) ?? FALLBACKS.explanation,
    mastered: false,
  };
}

function validateAndBuildSession(topic: string, words: string[], payload: GenerateApiResponse): Session {
  if (!payload || !Array.isArray(payload.vocabulary)) {
    throw new GenerationError("Malformed response: missing vocabulary array", "MALFORMED_RESPONSE");
  }

  if (payload.vocabulary.length !== words.length) {
    throw new GenerationError("Malformed response: incorrect vocabulary length", "MALFORMED_RESPONSE");
  }

  const normalizedWords = payload.vocabulary.map((item, index) => normalizeItem(item ?? {}, words[index]));

  return {
    id: uuid(),
    topic,
    words: normalizedWords,
    createdAt: Date.now(),
  };
}

export async function generateVocabulary(topic: string, words: string[]): Promise<Session> {
  let response: Response;
  try {
    response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, words }),
    });
  } catch {
    throw new GenerationError("Network error while generating vocabulary", "NETWORK_ERROR");
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload && typeof payload.error === "string" ? payload.error : "Failed to generate vocabulary";
    throw new GenerationError(message, "NETWORK_ERROR");
  }

  return validateAndBuildSession(topic, words, payload as GenerateApiResponse);
}
