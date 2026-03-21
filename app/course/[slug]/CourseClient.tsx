"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
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
  const allLessonsInCourse = [...course.sections]
    .sort((a, b) => a.order - b.order)
    .flatMap(s => [...s.units]
        .sort((a, b) => a.order - b.order)
        .flatMap(u => [...u.lessons].sort((a, b) => a.order - b.order))
    );

  // Completed lesson IDs from the progress map
  const completedLessonIds = Object.keys(lessonProgressMap);

  // Výpočet aktuálně hratelných lekcí
  const playableIds = [...completedLessonIds];

  // První lekce kurzu je vždy odemčená
  if (allLessonsInCourse.length > 0 && !playableIds.includes(allLessonsInCourse[0].id)) {
    playableIds.push(allLessonsInCourse[0].id);
  }

  // Pokud je nějaká lekce hotová, odemkni tu hned po ní
  allLessonsInCourse.forEach((lesson, idx) => {
      if (completedLessonIds.includes(lesson.id) && idx < allLessonsInCourse.length - 1) {
          const nextId = allLessonsInCourse[idx + 1].id;
          if (!playableIds.includes(nextId)) {
              playableIds.push(nextId);
          }
      }
  });

  // Speciální pravidlo: Lekce z sekce "Procvičování" jsou odemčené, pokud má uživatel alespov 5 hotových lekcí
  const weakKeys = getWeakestKeys(difficultKeys, 10).map(k => k.char);
  const hasEnoughProgress = completedLessonIds.length >= 5;

  const worlds = currentSection.units.map(u => ({
    id: u.id,
    name: u.title,
    order: u.order,
    color: "var(--accent-color)",
    lessons: u.lessons.map(l => {
      let content = JSON.parse(l.content);
      const criteria = JSON.parse(l.criteria);

      // Dynamické přepsání obsahu pro procvičovací lekce (pokud se tam nějaké dostanou z DB)
      if (course.slug === 'deseti-prsty' && l.slug.startsWith('s9u1-weak')) {
        if (weakKeys.length > 0) {
          content = {
            mode: "letter",
            letters: generateDifficultKeysPractice(weakKeys, 50)
          };
        }
      }

      return {
        ...l,
        content,
        criteria
      };
    })
  }));

  // Pokud jsme v kurzu deseti-prsty a máme problémové klávesy,
  // přidáme speciální unit pro procvičování na konec každé sekce
  if (course.slug === 'deseti-prsty' && weakKeys.length > 0 && currentSection.order < 9) {
    // Najdeme ID pro tyto lekce z kurzu (pokud tam jsou)
    const weak1 = allLessonsInCourse.find(l => l.slug === "s9u1-weak1");
    const weak2 = allLessonsInCourse.find(l => l.slug === "s9u1-weak2");
    const weak3 = allLessonsInCourse.find(l => l.slug === "s9u1-weak3");

    if (weak1) {
      worlds.push({
        id: "dynamic-practice-unit",
        name: "Problémové klávesy",
        order: 99,
        color: "#ff4b4b", // Reddish for "problems"
        lessons: [
          {
            id: weak1.id,
            title: "Slabá místa (Úroveň 1)",
            slug: weak1.slug,
            content: {
              mode: "letter" as const,
              letters: generateDifficultKeysPractice(weakKeys, 40)
            },
            criteria: { minAccuracy: 90, minWpm: 0 },
            isReview: true,
            xp: 15,
            order: 1,
            unitId: "dynamic-practice-unit"
          },
          ...(weak2 ? [{
            id: weak2.id,
            title: "Slabá místa (Úroveň 2)",
            slug: weak2.slug,
            content: {
              mode: "letter" as const,
              letters: generateDifficultKeysPractice(weakKeys, 60)
            },
            criteria: { minAccuracy: 92, minWpm: 0 },
            isReview: true,
            xp: 15,
            order: 2,
            unitId: "dynamic-practice-unit"
          }] : []),
          ...(weak3 ? [{
            id: weak3.id,
            title: "Slabá místa (Úroveň 3)",
            slug: weak3.slug,
            content: {
              mode: "letter" as const,
              letters: generateDifficultKeysPractice(weakKeys, 80)
            },
            criteria: { minAccuracy: 95, minWpm: 0 },
            isReview: true,
            xp: 20,
            order: 3,
            unitId: "dynamic-practice-unit"
          }] : [])
        ]
      });

      // Ensure the dynamic lessons are unlocked
      if (!playableIds.includes(weak1.id)) playableIds.push(weak1.id);
      if (weak2 && !playableIds.includes(weak2.id)) playableIds.push(weak2.id);
      if (weak3 && !playableIds.includes(weak3.id)) playableIds.push(weak3.id);
    }
  }

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
    <div className="flex flex-col min-h-screen">
      <AnimatePresence mode="wait">
        {view === 'map' ? (
          <JourneyPage
            worlds={worlds}
            unlockedLevels={playableIds}
            lessonProgressMap={lessonProgressMap}
            onStartLesson={(idx) => {
                const lessonsInThisSection = worlds.flatMap(w => w.lessons);
                const lesson = lessonsInThisSection[idx];
                handleStartLesson(lesson);
            }}
          />
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
