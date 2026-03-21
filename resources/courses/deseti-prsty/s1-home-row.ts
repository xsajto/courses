/**
 * Section 1: Domácí řada (Home row)
 * Letters: f, j, d, k, s, l, a, ů, g, h + space
 * 7 units, ~46 lessons
 */
import {
  buildStandardUnit,
  buildReviewUnit,
  resetLessonOrder,
  type SectionDef,
} from "./helpers";
import { SENTENCES_HOME } from "../../vocabulary";

export function buildSection1(): SectionDef {
  resetLessonOrder();

  const units = [];
  let pool: string[] = [];

  // Unit 1: F and J
  pool = ["f", "j"];
  units.push(buildStandardUnit({
    unitTitle: "Písmena F a J",
    unitOrder: 1,
    slugPrefix: "s1u1",
    newLetters: ["f", "j"],
    allKnown: pool,
    sentences: SENTENCES_HOME,
    sentenceStartIdx: 0,
    wpmRange: [10, 18],
    accRange: [70, 78],
  }));

  // Unit 2: D and K
  pool = ["f", "j", "d", "k"];
  units.push(buildStandardUnit({
    unitTitle: "Písmena D a K",
    unitOrder: 2,
    slugPrefix: "s1u2",
    newLetters: ["d", "k"],
    allKnown: pool,
    sentences: SENTENCES_HOME,
    sentenceStartIdx: 1,
    wpmRange: [12, 22],
    accRange: [72, 80],
  }));

  // Unit 3: S and L
  pool = ["f", "j", "d", "k", "s", "l"];
  units.push(buildStandardUnit({
    unitTitle: "Písmena S a L",
    unitOrder: 3,
    slugPrefix: "s1u3",
    newLetters: ["s", "l"],
    allKnown: pool,
    sentences: SENTENCES_HOME,
    sentenceStartIdx: 2,
    wpmRange: [15, 25],
    accRange: [74, 82],
  }));

  // Unit 4: A and Ů
  pool = ["f", "j", "d", "k", "s", "l", "a", "ů"];
  units.push(buildStandardUnit({
    unitTitle: "Písmena A a Ů",
    unitOrder: 4,
    slugPrefix: "s1u4",
    newLetters: ["a", "ů"],
    allKnown: pool,
    sentences: SENTENCES_HOME,
    sentenceStartIdx: 3,
    wpmRange: [18, 30],
    accRange: [76, 84],
  }));

  // Unit 5: G and H
  pool = ["f", "j", "d", "k", "s", "l", "a", "ů", "g", "h"];
  units.push(buildStandardUnit({
    unitTitle: "Písmena G a H",
    unitOrder: 5,
    slugPrefix: "s1u5",
    newLetters: ["g", "h"],
    allKnown: pool,
    sentences: SENTENCES_HOME,
    sentenceStartIdx: 4,
    wpmRange: [22, 35],
    accRange: [78, 86],
  }));

  // Unit 6: Space and words
  pool = ["f", "j", "d", "k", "s", "l", "a", "ů", "g", "h", " "];
  units.push(buildStandardUnit({
    unitTitle: "Mezerník a slova",
    unitOrder: 6,
    slugPrefix: "s1u6",
    newLetters: [" "],
    allKnown: pool,
    sentences: SENTENCES_HOME,
    sentenceStartIdx: 5,
    wpmRange: [28, 40],
    accRange: [80, 88],
  }));

  // Unit 7: Review
  pool = ["f", "j", "d", "k", "s", "l", "a", "ů", "g", "h", " "];
  units.push(buildReviewUnit({
    unitTitle: "Opakování domácí řady",
    unitOrder: 7,
    slugPrefix: "s1u7",
    allKnown: pool,
    sentences: SENTENCES_HOME,
    wpm: 45,
    acc: 90,
    lessonCount: 6,
  }));

  return {
    title: "Domácí řada",
    order: 1,
    units,
  };
}

/** The full home-row letter pool after Section 1 */
export const POOL_AFTER_S1 = ["f", "j", "d", "k", "s", "l", "a", "ů", "g", "h", " "];
