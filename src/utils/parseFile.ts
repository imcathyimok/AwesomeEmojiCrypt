// Parses txt/json files for vocabulary input.
export async function parseFile(file: File): Promise<string[]> {
  const text = await file.text();
  const name = file.name.toLowerCase();

  if (name.endsWith(".json")) {
    return [text];
  }

  return text
    .split(/\r?\n/g)
    .map((line) => line.trim())
    .filter(Boolean);
}
