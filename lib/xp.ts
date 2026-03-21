export interface XpBreakdown {
  baseXp: number;
  accuracyBonus: number;
  speedBonus: number;
  perfectBonus: number;
  totalXp: number;
}

export function calculateXp(params: {
  baseXp: number;
  accuracy: number;
  wpm: number;
  minWpm: number;
  passed: boolean;
}): XpBreakdown {
  if (!params.passed) {
    return { baseXp: 0, accuracyBonus: 0, speedBonus: 0, perfectBonus: 0, totalXp: 0 };
  }

  const baseXp = params.baseXp;
  const accuracyBonus = params.accuracy >= 95 ? 5 : 0;
  const speedBonus = params.minWpm > 0 && params.wpm >= params.minWpm * 1.5 ? 5 : 0;
  const perfectBonus = params.accuracy >= 100 ? 5 : 0;

  return {
    baseXp,
    accuracyBonus,
    speedBonus,
    perfectBonus,
    totalXp: baseXp + accuracyBonus + speedBonus + perfectBonus,
  };
}

export function computeMasteryLevel(currentLevel: number, passed: boolean): number {
  if (!passed) return currentLevel;
  return Math.min(currentLevel + 1, 2);
}
