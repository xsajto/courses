/**
 * Generate practice sequences focused on difficult (weak) characters.
 * 70% weak chars, 30% context chars for natural typing flow.
 */

const CONTEXT_CHARS = "asdfjkl;gh".split("");

export function generateDifficultKeysPractice(
  weakChars: string[],
  length = 40
): string[] {
  if (weakChars.length === 0) return [];

  const result: string[] = [];
  for (let i = 0; i < length; i++) {
    if (Math.random() < 0.7 || CONTEXT_CHARS.length === 0) {
      // Pick a weak char (weighted: first chars appear more often)
      const idx = Math.floor(Math.random() * Math.min(weakChars.length, 5));
      result.push(weakChars[idx]);
    } else {
      // Context char for natural typing
      result.push(CONTEXT_CHARS[Math.floor(Math.random() * CONTEXT_CHARS.length)]);
    }
  }
  return result;
}

/**
 * Sort error map by frequency and return the worst keys.
 */
export function getWeakestKeys(
  charErrors: Record<string, number>,
  limit = 10
): { char: string; count: number }[] {
  return Object.entries(charErrors)
    .map(([char, count]) => ({ char, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
