"use client";

import React, { useMemo } from "react";
import { Monitor } from "lucide-react";
import { normalizeContent, type GameContent } from "@/lib/game-types";
import { CopyingMode } from "./modes/CopyingMode";
import { LetterMode } from "./modes/LetterMode";
import { NewLetterMode } from "./modes/NewLetterMode";
import { RainingMode } from "./modes/RainingMode";
import { FastRainingMode } from "./modes/FastRainingMode";

interface GameRouterProps {
  lesson: {
    id: string;
    content: GameContent | string;
    criteria: { minAccuracy: number; minWpm: number } | string;
    xp: number;
    isReview: boolean;
  };
  onQuit: () => void;
  onFinish: (stats: {
    accuracy: number;
    wpm: number;
    passed: boolean;
    errorCount?: number;
    errors?: string;
    totalTime?: number;
    baseXp?: number;
    bonusXp?: number;
    totalXp?: number;
  }) => void;
}

export const GameRouter: React.FC<GameRouterProps> = ({ lesson, onQuit, onFinish }) => {
  const content = useMemo(() => {
    try {
      const raw = typeof lesson.content === "string" ? JSON.parse(lesson.content) : lesson.content;
      return normalizeContent(raw);
    } catch {
      return normalizeContent({ text: lesson.content });
    }
  }, [lesson.content]);

  const criteria = useMemo(() => {
    try {
      const raw = typeof lesson.criteria === "string" ? JSON.parse(lesson.criteria) : lesson.criteria;
      return { minAccuracy: raw?.minAccuracy ?? 0, minWpm: raw?.minWpm ?? 0 };
    } catch {
      return { minAccuracy: 0, minWpm: 0 };
    }
  }, [lesson.criteria]);

  const xp = lesson.xp ?? (lesson.isReview ? 25 : 10);

  const gameElement = (() => {
    switch (content.mode) {
      case "copying":
        return (
          <CopyingMode
            content={content}
            criteria={criteria}
            xp={xp}
            isReview={lesson.isReview}
            onQuit={onQuit}
            onFinish={onFinish}
          />
        );

      case "letter":
        return (
          <LetterMode
            content={content}
            criteria={criteria}
            xp={xp}
            isReview={lesson.isReview}
            onQuit={onQuit}
            onFinish={onFinish}
          />
        );

      case "new-letter":
        return (
          <NewLetterMode
            content={content}
            criteria={criteria}
            xp={xp}
            isReview={lesson.isReview}
            onQuit={onQuit}
            onFinish={onFinish}
          />
        );

      case "raining":
        return (
          <RainingMode
            content={content}
            criteria={criteria}
            xp={xp}
            isReview={lesson.isReview}
            onQuit={onQuit}
            onFinish={onFinish}
          />
        );

      case "fast-raining":
        return (
          <FastRainingMode
            content={content}
            criteria={criteria}
            xp={xp}
            isReview={lesson.isReview}
            onQuit={onQuit}
            onFinish={onFinish}
          />
        );

      default:
        return null;
    }
  })();

  return (
    <>
      {/* Mobile blocker — game requires physical keyboard */}
      <div className="md:hidden h-screen flex flex-col items-center justify-center p-8 text-center bg-white">
        <Monitor className="size-16 text-duo-gray-dark mb-6" />
        <h2 className="text-2xl font-black text-duo-text mb-2">
          Hra vyžaduje větší obrazovku
        </h2>
        <p className="text-duo-gray-dark font-bold mb-8">
          Pro psaní všemi deseti prsty potřebuješ fyzickou klávesnici a obrazovku alespoň 768px.
        </p>
        <button onClick={onQuit} className="secondary-btn">
          Zpět na mapu
        </button>
      </div>
      {/* Game (hidden on mobile) */}
      <div className="hidden md:block">
        {gameElement}
      </div>
    </>
  );
};
