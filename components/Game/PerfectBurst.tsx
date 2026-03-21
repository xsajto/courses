"use client";

import React from "react";
import { motion } from "framer-motion";

const RAYS = 12;
const STARS = 8;

export function PerfectBurst() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[85]">
      {/* Expanding ring */}
      <motion.div
        className="absolute rounded-full border-4 border-duo-yellow"
        initial={{ width: 0, height: 0, opacity: 1 }}
        animate={{ width: 300, height: 300, opacity: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      />

      {/* Rays */}
      {Array.from({ length: RAYS }, (_, i) => {
        const angle = (i / RAYS) * 360;
        return (
          <motion.div
            key={`ray-${i}`}
            className="absolute w-1 bg-duo-yellow rounded-full origin-bottom"
            style={{
              height: 0,
              rotate: `${angle}deg`,
            }}
            initial={{ height: 0, opacity: 1 }}
            animate={{ height: 120, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          />
        );
      })}

      {/* Stars */}
      {Array.from({ length: STARS }, (_, i) => {
        const angle = (i / STARS) * 360;
        const radius = 80 + Math.random() * 40;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;
        return (
          <motion.div
            key={`star-${i}`}
            className="absolute text-duo-yellow text-lg"
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{ x, y, scale: [0, 1.5, 0], opacity: [1, 1, 0] }}
            transition={{ duration: 1, delay: 0.2 + i * 0.05 }}
          >
            ★
          </motion.div>
        );
      })}
    </div>
  );
}
