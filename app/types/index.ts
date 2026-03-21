export interface Lesson {
  id: number;
  title: string;
  text: string;
  difficulty: "Beginner" | "Apprentice" | "Warrior" | "Advanced" | "Elite" | "Master" | "Legend";
}

export interface World {
  id: string;
  name: string;
  color: string;
  lessons: Lesson[];
}

export interface GameStats {
  wpm: number;
  accuracy: number;
  errorCount: number;
  errors: Record<string, number>;
  totalTime: number;
}
