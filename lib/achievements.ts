export type AchievementCategory = "streak" | "lessons" | "performance" | "xp" | "mastery";
export type AchievementTier = "green" | "blue" | "purple" | "gold";

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  tier: AchievementTier;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  // Streak
  { id: "streak-7", name: "Týdenní série", description: "7 dní v řadě", icon: "🔥", category: "streak", tier: "green" },
  { id: "streak-30", name: "Měsíční série", description: "30 dní v řadě", icon: "🔥", category: "streak", tier: "blue" },
  { id: "streak-100", name: "Stovka", description: "100 dní v řadě", icon: "🔥", category: "streak", tier: "purple" },
  { id: "streak-365", name: "Roční série", description: "365 dní v řadě", icon: "🔥", category: "streak", tier: "gold" },

  // Lessons
  { id: "lessons-1", name: "První lekce", description: "Dokonči svou první lekci", icon: "📖", category: "lessons", tier: "green" },
  { id: "lessons-10", name: "Začátečník", description: "Dokonči 10 lekcí", icon: "📚", category: "lessons", tier: "green" },
  { id: "lessons-50", name: "Pokročilý", description: "Dokonči 50 lekcí", icon: "📚", category: "lessons", tier: "blue" },
  { id: "lessons-100", name: "Expert", description: "Dokonči 100 lekcí", icon: "📚", category: "lessons", tier: "purple" },

  // Performance
  { id: "perfect-first", name: "Perfekcionista", description: "Dokonči lekci se 100% přesností", icon: "🎯", category: "performance", tier: "green" },
  { id: "wpm-40", name: "Rychlopísař", description: "Dosáhni 40 zn/min", icon: "⚡", category: "performance", tier: "blue" },
  { id: "wpm-50", name: "Blesk", description: "Dosáhni 50 zn/min", icon: "⚡", category: "performance", tier: "purple" },
  { id: "accuracy-95-x10", name: "Přesný střelec", description: "10× přesnost nad 95%", icon: "🎯", category: "performance", tier: "blue" },

  // XP
  { id: "xp-100", name: "Sběratel XP", description: "Získej 100 XP celkem", icon: "⭐", category: "xp", tier: "green" },
  { id: "xp-1000", name: "XP mašina", description: "Získej 1 000 XP celkem", icon: "⭐", category: "xp", tier: "blue" },
  { id: "xp-10000", name: "XP legenda", description: "Získej 10 000 XP celkem", icon: "⭐", category: "xp", tier: "gold" },

  // Mastery
  { id: "gold-first", name: "První zlato", description: "Získej svou první zlatou lekci", icon: "👑", category: "mastery", tier: "green" },
  { id: "gold-10", name: "Zlatý mistr", description: "Získej 10 zlatých lekcí", icon: "👑", category: "mastery", tier: "gold" },
];

export const TIER_COLORS: Record<AchievementTier, string> = {
  green: "var(--color-duo-green)",
  blue: "var(--color-duo-blue)",
  purple: "var(--color-duo-purple)",
  gold: "var(--color-duo-yellow)",
};
