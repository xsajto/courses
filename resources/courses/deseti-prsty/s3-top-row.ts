/**
 * Section 3: Horní řada — souhlásky (Top row consonants)
 * Adds: r, z, t, w, p, q
 * 4 units, ~24 lessons
 */
import {
  buildStandardUnit,
  buildReviewUnit,
  type SectionDef,
} from "./helpers";
import { SENTENCES_TOP } from "../../vocabulary";
import { POOL_AFTER_S2 } from "./s2-vowels";

export function buildSection3(): SectionDef {
  const units = [];
  let pool = [...POOL_AFTER_S2];

  // Unit 1: R and Z
  pool = [...pool, "r", "z"];
  units.push(buildStandardUnit({
    unitTitle: "Písmena R a Z",
    unitOrder: 1,
    slugPrefix: "s3u1",
    newLetters: ["r", "z"],
    allKnown: pool,
    sentences: SENTENCES_TOP,
    sentenceStartIdx: 0,
    wpmRange: [40, 48],
    accRange: [82, 87],
  }));

  // Unit 2: T and W
  pool = [...pool, "t", "w"];
  units.push(buildStandardUnit({
    unitTitle: "Písmena T a W",
    unitOrder: 2,
    slugPrefix: "s3u2",
    newLetters: ["t", "w"],
    allKnown: pool,
    sentences: SENTENCES_TOP,
    sentenceStartIdx: 1,
    wpmRange: [42, 50],
    accRange: [83, 88],
  }));

  // Unit 3: P and Q
  pool = [...pool, "p", "q"];
  units.push(buildStandardUnit({
    unitTitle: "Písmena P a Q",
    unitOrder: 3,
    slugPrefix: "s3u3",
    newLetters: ["p", "q"],
    allKnown: pool,
    sentences: SENTENCES_TOP,
    sentenceStartIdx: 2,
    wpmRange: [44, 52],
    accRange: [84, 89],
  }));

  // Unit 4: Review
  units.push(buildReviewUnit({
    unitTitle: "Opakování horní řady",
    unitOrder: 4,
    slugPrefix: "s3u4",
    allKnown: pool,
    sentences: SENTENCES_TOP,
    wpm: 55,
    acc: 90,
    lessonCount: 5,
  }));

  return {
    title: "Horní řada — souhlásky",
    order: 3,
    units,
  };
}

export const POOL_AFTER_S3 = [...POOL_AFTER_S2, "r", "z", "t", "w", "p", "q"];
