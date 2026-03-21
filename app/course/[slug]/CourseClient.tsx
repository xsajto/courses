"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Target } from "lucide-react";
import { JourneyPage } from "@/components/JourneyPage";
import { GameRouter } from "@/components/Game/GameRouter";
import { saveLessonProgress, type ProgressResult } from "@/app/actions/progress";
import { calculateXp } from "@/lib/xp";
import { useAchievements } from "@/components/AchievementProvider";
import { generateDifficultKeysPractice, getWeakestKeys } from "@/lib/practice-generator";
import type { CourseData, SectionData, ParsedLessonData, LessonProgressMap } from "@/lib/course-types";

export default function CourseClient({
  course,
  currentSection,
  lessonProgressMap,
  difficultKeys = {}
}: {
  course: CourseData,
  currentSection: SectionData,
  lessonProgressMap: LessonProgressMap,
  difficultKeys?: Record<string, number>
}) {
  const router = useRouter();
  const { showAchievements } = useAchievements();
  const [view, setView] = useState<'map' | 'playing'>('map');
  const [currentLesson, setCurrentLesson] = useState<ParsedLessonData | null>(null);
  const [lastResult, setLastResult] = useState<ProgressResult | null>(null);

  // Všechny lekce v celém kurzu pro výpočet odemykání
  const allLessonsInCourse = useMemo(() => [...course.sections]
    .sort((a, b) => a.order - b.order)
    .flatMap(s => [...s.units]
        .sort((a, b) => a.order - b.order)
        .flatMap(u => [...u.lessons].sort((a, b) => a.order - b.order))
    ), [course.sections]);

  // IDs hotových lekcí
  const completedLessonIds = useMemo(() => Object.keys(lessonProgressMap), [lessonProgressMap]);

  // Získáme všechny znaky, které se uživatel už naučil (vyskytují se v hotových lekcích)
  const learnedCharacters = useMemo(() => {
    const chars = new Set<string>();
    for (const lessonId of completedLessonIds) {
      const lesson = allLessonsInCourse.find(l => l.id === lessonId);
      if (!lesson) continue;
      try {
        const content = JSON.parse(lesson.content);
        if (content.mode === "letter" || content.mode === "raining" || content.mode === "fast-raining") {
          content.letters?.forEach((l: string) => chars.add(l));
        } else if (content.mode === "new-letter") {
          chars.add(content.letter);
          content.letters?.forEach((l: string) => chars.add(l));
        } else if (content.mode === "copying" && content.text) {
          // Pro textové lekce přidáme všechny unikátní znaky
          for (const char of content.text.toLowerCase()) {
            if (char !== " ") chars.add(char);
          }
        }
      } catch (e) {
        // Ignorovat chyby parsování
      }
    }
    return chars;
  }, [completedLessonIds, allLessonsInCourse]);

  // Výpočet aktuálně hratelných lekcí (unlocked)
  const playableIds = useMemo(() => {
    const ids = [...completedLessonIds];
    // První lekce kurzu je vždy odemčená
    if (allLessonsInCourse.length > 0 && !ids.includes(allLessonsInCourse[0].id)) {
      ids.push(allLessonsInCourse[0].id);
    }
    // Pokud je nějaká lekce hotová, odemkni tu hned po ní
    allLessonsInCourse.forEach((lesson, idx) => {
        if (completedLessonIds.includes(lesson.id) && idx < allLessonsInCourse.length - 1) {
            const nextId = allLessonsInCourse[idx + 1].id;
            if (!ids.includes(nextId)) {
                ids.push(nextId);
            }
        }
    });
    return ids;
  }, [completedLessonIds, allLessonsInCourse]);

  // Filtrujeme slabé klávesy — bereme jen ty, které se uživatel už naučil
  const weakKeys = useMemo(() => {
    const sorted = getWeakestKeys(difficultKeys, 20);
    return sorted
      .filter(k => learnedCharacters.has(k.char.toLowerCase()))
      .slice(0, 10)
      .map(k => k.char);
  }, [difficultKeys, learnedCharacters]);

  const worlds = useMemo(() => currentSection.units.map(u => ({
    id: u.id,
    name: u.title,
    order: u.order,
    color: "var(--accent-color)",
    lessons: u.lessons.map(l => ({
      ...l,
      content: JSON.parse(l.content),
      criteria: JSON.parse(l.criteria)
    }))
  })), [currentSection]);

  // Najdeme lekci pro procvičování slabých míst (v DB je pod slugem s9u1-weak1)
  const weakKeyLesson = allLessonsInCourse.find(l => l.slug === "s9u1-weak1");
  const practiceLesson: ParsedLessonData | null = (course.slug === 'deseti-prsty' && weakKeys.length > 0 && weakKeyLesson) 
    ? {
        ...weakKeyLesson,
        title: "Procvičit slabá místa",
        content: {
          mode: "letter" as const,
          letters: generateDifficultKeysPractice(weakKeys, 50)
        },
        criteria: { minAccuracy: 90, minWpm: 0 },
        isReview: true,
        xp: 15,
      } as any
    : null;

  const handleStartLesson = (lesson: ParsedLessonData) => {
    setCurrentLesson(lesson);
    setLastResult(null);
    setView('playing');
  };

  const handleFinish = async (stats: {
    accuracy: number;
    wpm: number;
    passed: boolean;
    errorCount?: number;
    errors?: string;
    totalTime?: number;
  }) => {
    if (!currentLesson) return;
    const baseXp = currentLesson.xp ?? (currentLesson.isReview ? 25 : 10);
    const criteria = currentLesson.criteria;
    const xpBreakdown = calculateXp({
      baseXp,
      accuracy: stats.accuracy,
      wpm: stats.wpm,
      minWpm: criteria.minWpm,
      passed: stats.passed,
    });
    const result = await saveLessonProgress(currentLesson.id, {
      ...stats,
      baseXp: xpBreakdown.baseXp,
      bonusXp: xpBreakdown.accuracyBonus + xpBreakdown.speedBonus + xpBreakdown.perfectBonus,
      totalXp: xpBreakdown.totalXp,
      xp: xpBreakdown.totalXp,
    });
    if (result && 'error' in result && result.error === 'lesson_not_found') {
      window.location.reload();
      return;
    }
    setLastResult(result);

    // Show achievement toasts
    if (result.newAchievements && result.newAchievements.length > 0) {
      showAchievements(result.newAchievements);
    }

    setView('map');
    router.refresh();
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      <AnimatePresence mode="wait">
        {view === 'map' ? (
          <>
            <JourneyPage
              worlds={worlds}
              unlockedLevels={playableIds}
              lessonProgressMap={lessonProgressMap}
              onStartLesson={(idx) => {
                  const lessonsInThisSection = worlds.flatMap(w => w.lessons);
                  const lesson = lessonsInThisSection[idx];
                  handleStartLesson(lesson);
              }}
              headerAction={practiceLesson ? (
                <button
                  onClick={() => handleStartLesson(practiceLesson)}
                  title="Procvičit slabá místa"
                  className="p-4 bg-duo-red rounded-2xl text-white shadow-[0_5px_0_#bf2d2d] active:translate-y-1 active:shadow-none transition-all group hover:bg-duo-red-dark"
                >
                  <Target size={28} className="group-hover:scale-110 transition-transform" />
                </button>
              ) : null}
            />
          </>
        ) : currentLesson && (
          <GameRouter
            lesson={{
              id: currentLesson.id,
              content: currentLesson.content,
              criteria: currentLesson.criteria,
              xp: currentLesson.xp ?? (currentLesson.isReview ? 25 : 10),
              isReview: currentLesson.isReview,
            }}
            onQuit={() => setView('map')}
            onFinish={handleFinish}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
