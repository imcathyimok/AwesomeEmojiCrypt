export type VocabWord = {
  word: string;
  definition: string;
  emojis: string;
  explanation: string;
  mastered?: boolean;
  quizCorrect?: boolean;
};

export type Session = {
  id: string;
  topic: string;
  words: VocabWord[];
  createdAt: number;
};

export type SessionHistoryItem = {
  id: string;
  topic: string;
  createdAt: number;
  wordCount: number;
};

export type GenerateRequest = {
  topic: string;
  words: string[];
};

export type RawVocabularyItem = Partial<Pick<VocabWord, "word" | "definition" | "emojis" | "explanation">>;

export type GenerateApiResponse = {
  topic?: string;
  vocabulary?: RawVocabularyItem[];
};

export class GenerationError extends Error {
  code: "MALFORMED_RESPONSE" | "NETWORK_ERROR";

  constructor(message: string, code: "MALFORMED_RESPONSE" | "NETWORK_ERROR") {
    super(message);
    this.name = "GenerationError";
    this.code = code;
  }
}
