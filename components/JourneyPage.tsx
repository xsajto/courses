"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trophy, BookOpen, Zap, LayoutGrid, Sparkle, Type, CloudRain, CloudLightning, Keyboard, X, Crown } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { cn } from "@/lib/utils";
import { theme, UNIT_COLORS, UNIT_COLORS_DARK } from "@/lib/theme";
import { computeUrgency, urgencyColor } from "@/lib/review";
import type { WorldData, ParsedLessonData, LessonProgressMap } from "@/lib/course-types";

function getModeIcon(mode?: string) {
  switch (mode) {
    case 'new-letter': return Sparkle;
    case 'letter': return Type;
    case 'raining': return CloudRain;
    case 'fast-raining': return CloudLightning;
    case 'copying': return Keyboard;
    default: return Star;
  }
}

interface JourneyPageProps {
  worlds: WorldData[];
  unlockedLevels: string[];
  lessonProgressMap: LessonProgressMap;
  onStartLesson: (lessonIdx: number) => void;
}

export const JourneyPage: React.FC<JourneyPageProps> = ({ worlds, unlockedLevels, lessonProgressMap, onStartLesson }) => {
  const [selectedLesson, setSelectedLesson] = useState<{ lesson: ParsedLessonData, globalIdx: number } | null>(null);
  const [guideWorld, setGuideWorld] = useState<WorldData | null>(null);
  const params = useParams();
  const allLessonsInView = worlds.flatMap(w => w.lessons);
  const currentLessonRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the current (last unlocked) lesson on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      currentLessonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleNodeClick = (lesson: ParsedLessonData, globalIdx: number, isUnlocked: boolean) => {
    if (!isUnlocked) return;
    if (selectedLesson?.lesson.id === lesson.id) {
      setSelectedLesson(null);
    } else {
      setSelectedLesson({ lesson, globalIdx });
    }
  };

  return (
    <div className="flex flex-col items-center pb-32">
      {/* Header navigace sekcí */}
      <div className="w-full max-w-lg sticky top-0 z-40 bg-white/95 backdrop-blur-sm pt-6 pb-4 px-4 border-b-2 border-duo-gray mb-8">
        <Link
            href={`/course/${params.slug}/sections`}
            className="w-full flex items-center justify-between p-4 bg-duo-blue rounded-2xl text-white shadow-[0_5px_0_var(--color-duo-blue-dark)] active:translate-y-1 active:shadow-none transition-all group"
        >
            <div className="flex items-center gap-4">
                <LayoutGrid className="size-6 transition-transform group-hover:rotate-90" />
                <span className="font-black uppercase tracking-widest text-sm">Změnit sekci</span>
            </div>
            <Trophy className="size-6" />
        </Link>
      </div>

      <div className="w-full max-w-lg px-4 space-y-8">
        {worlds.map((world, wIdx) => {
          const unitColor = UNIT_COLORS[wIdx % 5];
          const unitColorDark = UNIT_COLORS_DARK[wIdx % 5];

          return (
            <div key={world.id} className="flex flex-col items-center">
              {/* Oblast Header */}
              <div
                className="w-full rounded-2xl p-6 text-white flex justify-between items-center mb-12"
                style={{
                  backgroundColor: unitColor,
                  boxShadow: `0 8px 0 ${unitColorDark}`,
                }}
              >
                <div className="space-y-1">
                  <h2 className="text-xl font-black uppercase tracking-tighter opacity-80">Oblast {world.order ?? wIdx + 1}</h2>
                  <p className="text-2xl font-black">{world.name}</p>
                </div>
                <button
                  onClick={() => setGuideWorld(world)}
                  className="bg-black/10 hover:bg-black/20 p-4 rounded-xl transition-colors border-2 border-transparent active:scale-95"
                >
                  <BookOpen size={28} />
                </button>
              </div>

              {/* Lekce (Nodes) */}
              <div className="flex flex-col items-center gap-8 w-full relative">
                {world.lessons.map((lesson, lIdx) => {
                  const globalIdx = allLessonsInView.findIndex(al => al.id === lesson.id);
                  const isUnlocked = unlockedLevels.includes(lesson.id);
                  const progress = lessonProgressMap[lesson.id];
                  const isCompleted = !!progress;
                  const masteryLevel = progress?.masteryLevel ?? -1;
                  const isGold = masteryLevel >= 2;
                  const isCurrent = !isCompleted && isUnlocked;
                  const lessonXp = lesson.xp ?? (lesson.isReview ? 25 : 10);

                  // Spaced repetition urgency
                  const urgency = isCompleted && progress.completedAt
                    ? computeUrgency(progress.completedAt, progress.bestAccuracy, progress.masteryLevel)
                    : 0;
                  const urgencyRingColor = urgencyColor(urgency);

                  // Winding Path logic - rounded to avoid hydration mismatch
                  const offset = Math.round(Math.sin(lIdx * 0.8) * 100);

                  // Node color: gold for mastery 2, review yellow, unit color, or gray
                  const nodeColor = !isUnlocked
                    ? theme.gray
                    : isGold
                      ? theme.yellow
                      : lesson.isReview
                        ? theme.yellow
                        : unitColor;

                  const nodeShadow = isUnlocked
                    ? `0 8px 0 rgba(0,0,0,0.2)`
                    : `0 8px 0 ${theme.grayDark}`;

                  const currentGlow = isCurrent
                    ? `, 0 0 0 4px white, 0 0 0 8px ${unitColor}, 0 0 20px ${unitColor}80`
                    : '';

                  const goldGlow = isGold
                    ? `, 0 0 12px ${theme.yellow}60`
                    : '';

                  // Choose icon based on mastery and game mode
                  const IconComponent = isGold
                    ? Crown
                    : lesson.isReview
                      ? Zap
                      : isCompleted
                        ? Trophy
                        : getModeIcon(lesson.content?.mode);

                  return (
                    <div
                      key={lesson.id}
                      ref={isCurrent ? currentLessonRef : undefined}
                      className="relative z-10 flex flex-col items-center"
                      style={{ transform: `translateX(${offset}px)` }}
                    >
                      <div className="relative">
                        <AnimatePresence>
                          {selectedLesson?.lesson.id === lesson.id && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.8 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.8 }}
                              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-white border-2 border-duo-gray rounded-2xl p-4 shadow-xl z-50 w-52 text-center"
                            >
                              <div className="absolute top-full left-1/2 -translate-x-1/2 border-x-[10px] border-x-transparent border-t-[10px] border-t-white" />
                              <h4 className="font-black text-duo-text mb-1 leading-tight">{lesson.title}</h4>
                              {progress && (
                                <div className="text-xs text-duo-gray-dark font-bold mb-2 space-y-0.5">
                                  {progress.bestAccuracy != null && <p>Přesnost: {progress.bestAccuracy.toFixed(0)}%</p>}
                                  {progress.bestWpm != null && <p>Rychlost: {progress.bestWpm} zn/min</p>}
                                  <p>Pokusy: {progress.attemptCount}</p>
                                </div>
                              )}
                              {urgencyRingColor && (
                                <p className="text-xs font-black mb-2" style={{ color: urgencyRingColor }}>
                                  Potřebuje opakování
                                </p>
                              )}
                              <button
                                className={cn(
                                  "w-full py-2 text-sm",
                                  urgencyRingColor ? "danger-btn" : "primary-btn"
                                )}
                                onClick={() => onStartLesson(globalIdx)}
                              >
                                {urgencyRingColor ? 'OPAKOVAT' : isCompleted ? 'ZOPAKOVAT' : 'START'} +{lessonXp} XP
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <motion.button
                          whileHover={isUnlocked ? { scale: 1.05 } : {}}
                          whileTap={isUnlocked ? { scale: 0.95 } : {}}
                          onClick={() => handleNodeClick(lesson, globalIdx, isUnlocked)}
                          className={cn(
                            "map-node relative",
                            !isUnlocked && "opacity-50",
                          )}
                          style={{
                            backgroundColor: nodeColor,
                            boxShadow: nodeShadow + currentGlow + goldGlow,
                          }}
                        >
                          <IconComponent
                            size={32}
                            fill={isUnlocked ? "white" : "currentColor"}
                            className={isUnlocked ? "text-white" : "text-duo-gray-dark"}
                          />
                          {/* Gold shimmer overlay */}
                          {isGold && (
                            <motion.div
                              className="absolute inset-0 rounded-full pointer-events-none"
                              style={{
                                background: 'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
                                backgroundSize: '200% 100%',
                              }}
                              animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                            />
                          )}
                          {/* Urgency ring for spaced repetition */}
                          {urgencyRingColor && (
                            <motion.div
                              className="absolute -inset-1.5 rounded-full border-[3px] pointer-events-none"
                              style={{ borderColor: urgencyRingColor }}
                              animate={{ opacity: [0.6, 1, 0.6] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          )}
                          {/* Crown badge */}
                          {isCompleted && (
                            <div
                              className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white border-2 border-white"
                              style={{ backgroundColor: isGold ? theme.yellow : unitColor }}
                            >
                              {masteryLevel + 1}
                            </div>
                          )}
                        </motion.button>
                      </div>
                      <p className={cn(
                        "text-xs font-bold text-center mt-2 max-w-[120px] line-clamp-2",
                        isUnlocked ? "text-duo-text" : "text-duo-gray-dark/50"
                      )}>
                        {lesson.title}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Guide Modal */}
      <AnimatePresence>
        {guideWorld && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setGuideWorld(null)}
          >
            <motion.div
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative"
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setGuideWorld(null)}
                className="absolute top-4 right-4 text-duo-gray-dark hover:text-duo-text transition-colors"
              >
                <X size={24} />
              </button>
              <h3 className="text-xl font-black text-duo-text mb-1">
                Oblast {guideWorld.order ?? 1}
              </h3>
              <h2 className="text-2xl font-black mb-4" style={{ color: UNIT_COLORS[(worlds.indexOf(guideWorld)) % 5] }}>
                {guideWorld.name}
              </h2>

              {/* Letters covered */}
              {(() => {
                const allLetters = new Set<string>();
                for (const lesson of guideWorld.lessons) {
                  const content = lesson.content;
                  if ("letters" in content) {
                    for (const l of content.letters) allLetters.add(l);
                  }
                  if ("letter" in content) allLetters.add(content.letter);
                }
                const sorted = [...allLetters].filter(c => c.length === 1 && c !== ' ');
                return sorted.length > 0 ? (
                  <div className="mb-4">
                    <p className="text-xs font-black text-duo-gray-dark uppercase tracking-wider mb-2">Znaky</p>
                    <div className="flex flex-wrap gap-1.5">
                      {sorted.map(ch => (
                        <span key={ch} className="bg-duo-blue-light text-duo-blue font-black text-sm px-2.5 py-1 rounded-lg">
                          {ch}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Lessons list */}
              <div className="mb-4">
                <p className="text-xs font-black text-duo-gray-dark uppercase tracking-wider mb-2">
                  Lekce ({guideWorld.lessons.length})
                </p>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {guideWorld.lessons.map((lesson, i) => {
                    const ModeIcon = lesson.isReview ? Zap : getModeIcon(lesson.content?.mode);
                    return (
                      <div key={i} className="flex items-center gap-2 text-sm text-duo-text">
                        <ModeIcon size={14} className="text-duo-gray-dark flex-shrink-0" />
                        <span className="font-bold truncate">{lesson.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Criteria */}
              {guideWorld.lessons[0]?.criteria && (
                <div className="bg-duo-gray/30 rounded-xl p-3">
                  <p className="text-xs font-black text-duo-gray-dark uppercase tracking-wider mb-1">Kritéria</p>
                  <p className="text-sm font-bold text-duo-text">
                    Přesnost: {guideWorld.lessons[0].criteria.minAccuracy}%
                    {guideWorld.lessons[0].criteria.minWpm > 0 && (
                      <> | Rychlost: {guideWorld.lessons[0].criteria.minWpm} zn/min</>
                    )}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
