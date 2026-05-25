import { normalizeWords } from "@/utils/wordFormat";

// Parses pasted text across commas/new lines/semicolons.
export function parsePastedText(input: string): string[] {
  return normalizeWords(
    input
      .split(/[\n,;]+/g)
      .map((token) => token.trim())
      .filter(Boolean),
  );
}
