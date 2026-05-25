export function highlightEmojis(text: string): Array<{ token: string; isEmoji: boolean }> {
  const emojiRegex = /[\p{Extended_Pictographic}]/u;
  return [...text].map((char) => ({ token: char, isEmoji: emojiRegex.test(char) }));
}
