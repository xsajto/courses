import React from "react";
import { 
  Flame, 
  BookOpen, 
  Trophy, 
  Target, 
  Zap, 
  Star, 
  Crown, 
  GraduationCap,
  Flashlight,
  Timer,
  Award
} from "lucide-react";

export type AchievementCategory = "streak" | "lessons" | "performance" | "xp" | "mastery";
export type AchievementTier = "bronze" | "silver" | "gold" | "emerald";

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: AchievementCategory;
  tier: AchievementTier;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  // Streak
  { id: "streak-7", name: "Týdenní série", description: "7 dní v řadě", icon: <Flame />, category: "streak", tier: "bronze" },
  { id: "streak-30", name: "Měsíční série", description: "30 dní v řadě", icon: <Flame />, category: "streak", tier: "silver" },
  { id: "streak-100", name: "Stovka", description: "100 dní v řadě", icon: <Flame />, category: "streak", tier: "gold" },
  { id: "streak-365", name: "Roční série", description: "365 dní v řadě", icon: <Flame />, category: "streak", tier: "emerald" },

  // Lessons
  { id: "lessons-1", name: "První lekce", description: "Dokonči svou první lekci", icon: <BookOpen />, category: "lessons", tier: "bronze" },
  { id: "lessons-10", name: "Začátečník", description: "Dokonči 10 lekcí", icon: <GraduationCap />, category: "lessons", tier: "bronze" },
  { id: "lessons-50", name: "Pokročilý", description: "Dokonči 50 lekcí", icon: <Award />, category: "lessons", tier: "silver" },
  { id: "lessons-100", name: "Expert", description: "Dokonči 100 lekcí", icon: <Trophy />, category: "lessons", tier: "gold" },

  // Performance
  { id: "perfect-first", name: "Perfekcionista", description: "Dokonči lekci se 100% přesností", icon: <Target />, category: "performance", tier: "bronze" },
  { id: "wpm-40", name: "Rychlopísař", description: "Dosáhni 40 zn/min", icon: <Zap />, category: "performance", tier: "silver" },
  { id: "wpm-50", name: "Blesk", description: "Dosáhni 50 zn/min", icon: <Zap />, category: "performance", tier: "gold" },
  { id: "accuracy-95-x10", name: "Přesný střelec", description: "10× přesnost nad 95%", icon: <Timer />, category: "performance", tier: "silver" },

  // XP
  { id: "xp-100", name: "Sběratel XP", description: "Získej 100 XP celkem", icon: <Star />, category: "xp", tier: "bronze" },
  { id: "xp-1000", name: "XP mašina", description: "Získej 1 000 XP celkem", icon: <Star />, category: "xp", tier: "silver" },
  { id: "xp-10000", name: "XP legenda", description: "Získej 10 000 XP celkem", icon: <Star />, category: "xp", tier: "gold" },

  // Mastery
  { id: "gold-first", name: "První zlato", description: "Získej svou první zlatou lekci", icon: <Crown />, category: "mastery", tier: "bronze" },
  { id: "gold-10", name: "Zlatý mistr", description: "Získej 10 zlatých lekcí", icon: <Crown />, category: "mastery", tier: "gold" },
];

export const TIER_COLORS: Record<AchievementTier, string> = {
  bronze: "#d97706",
  silver: "#94a3b8",
  gold: "#f59e0b",
  emerald: "#10b981",
};
