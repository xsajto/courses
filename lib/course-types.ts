import type { GameContent } from "@/lib/game-types";

/** A lesson as stored in the database (content/criteria are JSON strings). */
export interface LessonData {
  id: string;
  title: string;
  slug: string;
  content: string;
  criteria: string;
  isReview: boolean;
  xp: number;
  order: number;
  unitId: string;
}

/** A lesson after JSON.parse — used in the journey map and game router. */
export interface ParsedLessonData {
  id: string;
  title: string;
  slug: string;
  content: GameContent;
  criteria: { minAccuracy: number; minWpm: number };
  isReview: boolean;
  xp: number;
  order: number;
  unitId: string;
}

export interface UnitData {
  id: string;
  title: string;
  order: number;
  sectionId: string;
  lessons: LessonData[];
}

export interface SectionData {
  id: string;
  title: string;
  order: number;
  courseId: string;
  units: UnitData[];
}

export interface CourseData {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  type: string;
  sections: SectionData[];
}

/** A unit transformed for the journey map (with parsed lessons). */
export interface WorldData {
  id: string;
  name: string;
  order: number;
  color: string;
  lessons: ParsedLessonData[];
}

/** Per-lesson progress summary passed from server to client. */
export type LessonProgressMap = Record<string, {
  masteryLevel: number;
  bestAccuracy: number | null;
  bestWpm: number | null;
  attemptCount: number;
  completedAt?: string;
}>;
