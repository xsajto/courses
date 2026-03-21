"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

const COLORS = ["#58cc02", "#1cb0f6", "#ff4b4b", "#ce82ff", "#ffc800"];
const PARTICLE_COUNT = 50;

export function Confetti() {
  const particles = useMemo(() =>
    Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * 100,          // start x (vw%)
      color: COLORS[i % COLORS.length],
      delay: Math.random() * 0.5,
      duration: 1.5 + Math.random() * 1.5,
      rotation: Math.random() * 720 - 360,
      size: 6 + Math.random() * 6,
      drift: (Math.random() - 0.5) * 30, // horizontal drift (vw%)
    })),
  []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[90] overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            top: -10,
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
          }}
          initial={{ y: 0, x: 0, rotate: 0, opacity: 1 }}
          animate={{
            y: "110vh",
            x: `${p.drift}vw`,
            rotate: p.rotation,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}
