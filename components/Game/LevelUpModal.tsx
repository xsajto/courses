"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";

interface LevelUpModalProps {
  show: boolean;
  newLevel: number;
  onClose: () => void;
}

export function LevelUpModal({ show, newLevel, onClose }: LevelUpModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-duo-yellow/90 flex items-center justify-center z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="text-center text-white"
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, y: 50 }}
            transition={{ type: "spring", damping: 12 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Star size={80} fill="white" className="mx-auto mb-6" />
            </motion.div>
            <p className="text-xl font-black uppercase tracking-widest mb-2 opacity-80">
              Nová úroveň!
            </p>
            <motion.p
              className="text-8xl font-black"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2, damping: 8 }}
            >
              {newLevel}
            </motion.p>
            <p className="mt-6 text-lg font-bold opacity-80">
              Klikni pro pokračování
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
