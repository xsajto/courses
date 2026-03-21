/** UTC date helpers and streak computation. */

export function getTodayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getYesterdayUTC(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

/**
 * Compute the new streak value given the user's last activity date and current streak.
 * Returns the updated streak count.
 */
export function computeStreak(
  lastActivityDate: string | null,
  currentStreak: number
): number {
  const today = getTodayUTC();
  const yesterday = getYesterdayUTC();

  if (lastActivityDate === today) {
    // Already active today — no change
    return currentStreak;
  }
  if (lastActivityDate === yesterday) {
    // Consecutive day — extend streak
    return currentStreak + 1;
  }
  // Gap of 2+ days — reset to 1 (today counts)
  return 1;
}
