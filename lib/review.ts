/**
 * Compute urgency for spaced repetition.
 * Returns a value between 0 and 1, where higher means more urgent.
 */
export function computeUrgency(
  completedAt: string,
  bestAccuracy: number | null,
  masteryLevel: number
): number {
  const daysSince = (Date.now() - new Date(completedAt).getTime()) / (1000 * 60 * 60 * 24);
  const decay = Math.min(1, daysSince / 14);
  const performance = ((bestAccuracy ?? 0) / 100) * 0.7 + Math.min(1, masteryLevel / 2) * 0.3;
  return decay * (1 - performance);
}

/**
 * Get a CSS color for a given urgency level.
 */
export function urgencyColor(urgency: number): string | null {
  if (urgency < 0.3) return null; // No visual indicator needed
  if (urgency < 0.5) return "var(--color-duo-yellow)";
  if (urgency < 0.7) return "#ff8c00"; // orange
  return "var(--color-duo-red)";
}
