export function capitalizeFirst(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

export function normalizeWords(words: string[]): string[] {
  return Array.from(new Set(words.map(capitalizeFirst).filter(Boolean)));
}
