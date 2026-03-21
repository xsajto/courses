/**
 * Section 4: Spodní řada (Bottom row)
 * Adds: n, m, v, b, c, x, y, comma, period, hyphen
 * 11 units (1 letter per unit), ~70 lessons
 */
import {
  buildStandardUnit,
  buildReviewUnit,
  type SectionDef,
} from "./helpers";
import {
  SENTENCES_BOTTOM_NM,
  SENTENCES_BOTTOM_VB,
  SENTENCES_FULL_LOWER,
} from "../../vocabulary";
import { POOL_AFTER_S3 } from "./s3-top-row";

export function buildSection4(): SectionDef {
  const units = [];
  let pool = [...POOL_AFTER_S3];

  // Unit 1: N
  pool = [...pool, "n"];
  units.push(buildStandardUnit({
    unitTitle: "Písmeno N",
    unitOrder: 1,
    slugPrefix: "s4u1",
    newLetters: ["n"],
    allKnown: pool,
    sentences: SENTENCES_BOTTOM_NM,
    sentenceStartIdx: 0,
    wpmRange: [50, 65],
    accRange: [85, 90],
  }));

  // Unit 2: M
  pool = [...pool, "m"];
  units.push(buildStandardUnit({
    unitTitle: "Písmeno M",
    unitOrder: 2,
    slugPrefix: "s4u2",
    newLetters: ["m"],
    allKnown: pool,
    sentences: SENTENCES_BOTTOM_NM,
    sentenceStartIdx: 2,
    wpmRange: [52, 67],
    accRange: [85, 90],
  }));

  // Unit 3: V
  pool = [...pool, "v"];
  units.push(buildStandardUnit({
    unitTitle: "Písmeno V",
    unitOrder: 3,
    slugPrefix: "s4u3",
    newLetters: ["v"],
    allKnown: pool,
    sentences: SENTENCES_BOTTOM_VB,
    sentenceStartIdx: 0,
    wpmRange: [54, 69],
    accRange: [85, 90],
  }));

  // Unit 4: B
  pool = [...pool, "b"];
  units.push(buildStandardUnit({
    unitTitle: "Písmeno B",
    unitOrder: 4,
    slugPrefix: "s4u4",
    newLetters: ["b"],
    allKnown: pool,
    sentences: SENTENCES_BOTTOM_VB,
    sentenceStartIdx: 2,
    wpmRange: [56, 71],
    accRange: [85, 91],
  }));

  // Unit 5: C
  pool = [...pool, "c"];
  units.push(buildStandardUnit({
    unitTitle: "Písmeno C",
    unitOrder: 5,
    slugPrefix: "s4u5",
    newLetters: ["c"],
    allKnown: pool,
    sentences: SENTENCES_FULL_LOWER,
    sentenceStartIdx: 0,
    wpmRange: [58, 73],
    accRange: [86, 91],
  }));

  // Unit 6: X
  pool = [...pool, "x"];
  units.push(buildStandardUnit({
    unitTitle: "Písmeno X",
    unitOrder: 6,
    slugPrefix: "s4u6",
    newLetters: ["x"],
    allKnown: pool,
    sentences: SENTENCES_FULL_LOWER,
    sentenceStartIdx: 1,
    wpmRange: [58, 73],
    accRange: [86, 91],
  }));

  // Unit 7: Y
  pool = [...pool, "y"];
  units.push(buildStandardUnit({
    unitTitle: "Písmeno Y",
    unitOrder: 7,
    slugPrefix: "s4u7",
    newLetters: ["y"],
    allKnown: pool,
    sentences: SENTENCES_FULL_LOWER,
    sentenceStartIdx: 2,
    wpmRange: [60, 75],
    accRange: [86, 91],
  }));

  // Unit 8: Comma
  pool = [...pool, ","];
  units.push(buildStandardUnit({
    unitTitle: "Čárka",
    unitOrder: 8,
    slugPrefix: "s4u8",
    newLetters: [","],
    allKnown: pool,
    sentences: SENTENCES_FULL_LOWER,
    sentenceStartIdx: 3,
    wpmRange: [60, 76],
    accRange: [87, 92],
  }));

  // Unit 9: Period
  pool = [...pool, "."];
  units.push(buildStandardUnit({
    unitTitle: "Tečka",
    unitOrder: 9,
    slugPrefix: "s4u9",
    newLetters: ["."],
    allKnown: pool,
    sentences: SENTENCES_FULL_LOWER,
    sentenceStartIdx: 4,
    wpmRange: [62, 78],
    accRange: [87, 92],
  }));

  // Unit 10: Hyphen
  pool = [...pool, "-"];
  units.push(buildStandardUnit({
    unitTitle: "Pomlčka",
    unitOrder: 10,
    slugPrefix: "s4u10",
    newLetters: ["-"],
    allKnown: pool,
    sentences: SENTENCES_FULL_LOWER,
    sentenceStartIdx: 5,
    wpmRange: [62, 78],
    accRange: [87, 92],
  }));

  // Unit 11: Full alphabet review
  units.push(buildReviewUnit({
    unitTitle: "Opakování celé abecedy",
    unitOrder: 11,
    slugPrefix: "s4u11",
    allKnown: pool,
    sentences: SENTENCES_FULL_LOWER,
    wpm: 80,
    acc: 92,
    lessonCount: 6,
  }));

  return {
    title: "Spodní řada",
    order: 4,
    units,
  };
}

export const POOL_AFTER_S4 = [
  ...POOL_AFTER_S3, "n", "m", "v", "b", "c", "x", "y", ",", ".", "-",
];
