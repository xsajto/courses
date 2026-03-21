/**
 * Section 2: Hlavní samohlásky (Main vowels)
 * Adds: e, i, o, u
 * 5 units, ~29 lessons
 */
import {
  buildStandardUnit,
  buildReviewUnit,
  type SectionDef,
} from "./helpers";
import {
  SENTENCES_E,
  SENTENCES_I,
  SENTENCES_O,
  SENTENCES_U,
  SENTENCES_HOME,
} from "../../vocabulary";
import { POOL_AFTER_S1 } from "./s1-home-row";

export function buildSection2(): SectionDef {
  const units = [];
  let pool = [...POOL_AFTER_S1];

  // Unit 1: E
  pool = [...pool, "e"];
  units.push(buildStandardUnit({
    unitTitle: "Písmeno E",
    unitOrder: 1,
    slugPrefix: "s2u1",
    newLetters: ["e"],
    allKnown: pool,
    sentences: SENTENCES_E,
    sentenceStartIdx: 0,
    wpmRange: [28, 38],
    accRange: [78, 85],
  }));

  // Unit 2: I
  pool = [...pool, "i"];
  units.push(buildStandardUnit({
    unitTitle: "Písmeno I",
    unitOrder: 2,
    slugPrefix: "s2u2",
    newLetters: ["i"],
    allKnown: pool,
    sentences: SENTENCES_I,
    sentenceStartIdx: 0,
    wpmRange: [30, 40],
    accRange: [79, 86],
  }));

  // Unit 3: O
  pool = [...pool, "o"];
  units.push(buildStandardUnit({
    unitTitle: "Písmeno O",
    unitOrder: 3,
    slugPrefix: "s2u3",
    newLetters: ["o"],
    allKnown: pool,
    sentences: SENTENCES_O,
    sentenceStartIdx: 0,
    wpmRange: [32, 42],
    accRange: [80, 87],
  }));

  // Unit 4: U
  pool = [...pool, "u"];
  units.push(buildStandardUnit({
    unitTitle: "Písmeno U",
    unitOrder: 4,
    slugPrefix: "s2u4",
    newLetters: ["u"],
    allKnown: pool,
    sentences: SENTENCES_U,
    sentenceStartIdx: 0,
    wpmRange: [34, 45],
    accRange: [81, 88],
  }));

  // Unit 5: Review
  units.push(buildReviewUnit({
    unitTitle: "Opakování samohlásek",
    unitOrder: 5,
    slugPrefix: "s2u5",
    allKnown: pool,
    sentences: [...SENTENCES_HOME, ...SENTENCES_E, ...SENTENCES_O, ...SENTENCES_U],
    wpm: 50,
    acc: 90,
    lessonCount: 5,
  }));

  return {
    title: "Hlavní samohlásky",
    order: 2,
    units,
  };
}

export const POOL_AFTER_S2 = [...POOL_AFTER_S1, "e", "i", "o", "u"];
