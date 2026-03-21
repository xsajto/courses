"use client";

import React, { useState, useMemo } from "react";
import { KeyboardHeatmap } from "@/components/Game/KeyboardHeatmap";
import { LetterMode } from "@/components/Game/modes/LetterMode";
import { getWeakestKeys, generateDifficultKeysPractice } from "@/lib/practice-generator";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import type { LetterContent } from "@/lib/game-types";

interface DifficultKeysClientProps {
  charErrors: Record<string, number>;
}

export function DifficultKeysClient({ charErrors }: DifficultKeysClientProps) {
  const [view, setView] = useState<"dashboard" | "practice">("dashboard");

  const weakKeys = useMemo(() => getWeakestKeys(charErrors, 10), [charErrors]);
  const hasErrors = weakKeys.length > 0;

  const practiceLetters = useMemo(
    () => generateDifficultKeysPractice(weakKeys.map(k => k.char), 40),
    [weakKeys]
  );

  const handleStartPractice = () => {
    if (!hasErrors) return;
    setView("practice");
  };

  const handleFinish = () => {
    setView("dashboard");
  };

  if (view === "practice" && practiceLetters.length > 0) {
    const content: LetterContent = {
      mode: "letter",
      letters: practiceLetters,
    };

    return (
      <LetterMode
        content={content}
        criteria={{ minAccuracy: 0, minWpm: 0 }}
        xp={10}
        isReview={false}
        onQuit={() => setView("dashboard")}
        onFinish={handleFinish}
      />
    );
  }

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-black text-duo-text mb-2">Problematické klávesy</h1>
      <p className="text-duo-gray-dark font-bold mb-8">
        Přehled kláves, se kterými máš nejčastější chyby.
      </p>

      {!hasErrors ? (
        <div className="text-center py-16">
          <AlertTriangle className="mx-auto text-duo-gray-dark mb-4" size={48} />
          <p className="text-lg font-black text-duo-text mb-2">Zatím žádné chyby!</p>
          <p className="text-duo-gray-dark font-bold">
            Dokonči několik lekcí a pak se sem vrať pro analýzu tvých problematických kláves.
          </p>
        </div>
      ) : (
        <>
          {/* Heatmap */}
          <section className="mb-8 flex justify-center">
            <KeyboardHeatmap charErrors={charErrors} />
          </section>

          {/* Weak keys list */}
          <section className="mb-8">
            <h2 className="text-xl font-black text-duo-text mb-4 uppercase tracking-tight">
              Top problémové klávesy
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {weakKeys.map(({ char, count }) => (
                <div
                  key={char}
                  className="border-2 border-duo-red/30 rounded-2xl p-4 flex flex-col items-center gap-1"
                >
                  <span className="text-2xl font-black text-duo-red">{char}</span>
                  <span className="text-xs font-bold text-duo-gray-dark">{count}× chyba</span>
                </div>
              ))}
            </div>
          </section>

          {/* Practice button */}
          <button
            onClick={handleStartPractice}
            className="primary-btn w-full py-4 text-lg"
          >
            PROCVIČIT PROBLÉMOVÉ KLÁVESY
          </button>
        </>
      )}
    </main>
  );
}
