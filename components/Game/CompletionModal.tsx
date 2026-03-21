"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, RotateCcw, XCircle, Zap } from "lucide-react";
import type { XpBreakdown } from "@/lib/xp";
import { Confetti } from "./Confetti";
import { PerfectBurst } from "./PerfectBurst";
import { useSounds } from "@/lib/useSounds";

interface CompletionModalProps {
  isFinished: boolean;
  passed: boolean;
  stats: { wpm: number; accuracy: number };
  xpBreakdown: XpBreakdown;
  failReasons: string[];
  errorCount?: number;
  onFinish: () => void;
  onRetry: () => void;
  onQuit: () => void;
}

function XpCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const { play } = useSounds();
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (target <= 0) return;
    const duration = 1000; // ms
    const steps = 30;
    const interval = duration / steps;
    let step = 0;

    const tick = () => {
      step++;
      const value = Math.round((step / steps) * target);
      setCount(Math.min(value, target));
      play("xp-tick", 0.1);
      if (step < steps) {
        rafRef.current = window.setTimeout(tick, interval) as unknown as number;
      }
    };

    // Start after a short delay
    rafRef.current = window.setTimeout(tick, 400) as unknown as number;

    return () => {
      if (rafRef.current) clearTimeout(rafRef.current);
    };
  }, [target, play]);

  return <span>{count > 0 ? count : target}</span>;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({
  isFinished, passed, stats, xpBreakdown, failReasons, errorCount, onFinish, onRetry, onQuit
}) => {
  const isPerfect = stats.accuracy >= 100;

  return (
    <AnimatePresence>
      {isFinished && passed && (
        <motion.div className="game-over-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Confetti />
          {isPerfect && <PerfectBurst />}
          <motion.div className="modal-content relative z-10" initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }}>
            <div className="mb-8 flex justify-center">
              <motion.div
                animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Trophy size={120} fill="currentColor" className="text-duo-yellow" />
              </motion.div>
            </div>
            <h1 className="text-4xl font-black text-duo-green mb-4">
              {isPerfect ? "Perfektní!" : "Lekce hotová!"}
            </h1>
            <div className="flex flex-col items-center gap-1 mb-6">
              <div className="flex items-center gap-2 text-duo-yellow">
                <Zap size={28} fill="currentColor" />
                <span className="text-2xl font-black">
                  +<XpCounter target={xpBreakdown.totalXp} /> XP
                </span>
              </div>
              <div className="text-xs font-bold text-duo-gray-dark space-y-0.5 mt-1">
                <p>Základ: +{xpBreakdown.baseXp}</p>
                {xpBreakdown.accuracyBonus > 0 && <p>Bonus za přesnost: +{xpBreakdown.accuracyBonus}</p>}
                {xpBreakdown.speedBonus > 0 && <p>Bonus za rychlost: +{xpBreakdown.speedBonus}</p>}
                {xpBreakdown.perfectBonus > 0 && <p>Perfektní lekce: +{xpBreakdown.perfectBonus}</p>}
              </div>
            </div>
            <div className="final-grid">
              <div className="final-stat bg-duo-yellow p-6 rounded-2xl text-white">
                <label className="text-white/80">RYCHLOST</label>
                <span>{stats.wpm}</span>
              </div>
              <div className="final-stat bg-duo-blue p-6 rounded-2xl text-white">
                <label className="text-white/80">PŘESNOST</label>
                <span>{stats.accuracy}%</span>
              </div>
              <div className="final-stat bg-duo-red p-6 rounded-2xl text-white">
                <label className="text-white/80">CHYBY</label>
                <span>{errorCount ?? 0}</span>
              </div>
            </div>
            <div className="mt-12">
              <button className="primary-btn w-[80%]" onClick={onFinish}>POKRAČOVAT</button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {isFinished && !passed && (
        <motion.div className="game-over-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.div className="modal-content" initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }}>
            <div className="mb-8 flex justify-center">
              <XCircle size={120} className="text-duo-red" />
            </div>
            <h1 className="text-4xl font-black text-duo-red mb-4">Zkus to znovu!</h1>
            <div className="final-grid">
              <div className="final-stat bg-duo-yellow p-6 rounded-2xl text-white">
                <label className="text-white/80">RYCHLOST</label>
                <span>{stats.wpm}</span>
              </div>
              <div className="final-stat bg-duo-blue p-6 rounded-2xl text-white">
                <label className="text-white/80">PŘESNOST</label>
                <span>{stats.accuracy}%</span>
              </div>
              <div className="final-stat bg-duo-red p-6 rounded-2xl text-white">
                <label className="text-white/80">CHYBY</label>
                <span>{errorCount ?? 0}</span>
              </div>
            </div>
            <div className="mt-6 space-y-2 text-sm">
              {failReasons.map((reason, i) => (
                <p key={i} className="text-duo-red font-bold">{reason}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-col items-center gap-3">
              <button
                className="danger-btn w-[80%] flex items-center justify-center gap-2"
                onClick={onRetry}
              >
                <RotateCcw size={18} />
                ZKUSIT ZNOVU
              </button>
              <button className="secondary-btn w-[80%]" onClick={onQuit}>ZPĚT NA MAPU</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
