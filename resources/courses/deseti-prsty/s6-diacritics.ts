/**
 * Section 6: Háčky a čárky (Diacritics)
 * Adds: ě, š, č, ř, ž, ý, á, í, é
 * 10 units (1 letter per unit), ~60 lessons
 */
import {
  buildStandardUnit,
  buildReviewUnit,
  type SectionDef,
} from "./helpers";
import {
  SENTENCES_DIAC_E,
  SENTENCES_DIAC_S,
  SENTENCES_DIAC_C,
  SENTENCES_DIAC_RZ,
  SENTENCES_DIAC_Y,
  SENTENCES_DIAC_A,
  SENTENCES_DIAC_I,
  SENTENCES_DIAC_EE,
  SENTENCES_FULL_DIAC,
} from "../../vocabulary";
import { POOL_AFTER_S5 } from "./s5-capitals";

export function buildSection6(): SectionDef {
  const units = [];
  let pool = [...POOL_AFTER_S5];

  // Unit 1: ě
  pool = [...pool, "ě"];
  units.push(buildStandardUnit({
    unitTitle: "Písmeno Ě",
    unitOrder: 1,
    slugPrefix: "s6u1",
    newLetters: ["ě"],
    allKnown: pool,
    sentences: SENTENCES_DIAC_E,
    sentenceStartIdx: 0,
    wpmRange: [65, 80],
    accRange: [86, 91],
  }));

  // Unit 2: š
  pool = [...pool, "š"];
  units.push(buildStandardUnit({
    unitTitle: "Písmeno Š",
    unitOrder: 2,
    slugPrefix: "s6u2",
    newLetters: ["š"],
    allKnown: pool,
    sentences: SENTENCES_DIAC_S,
    sentenceStartIdx: 0,
    wpmRange: [66, 81],
    accRange: [86, 91],
  }));

  // Unit 3: č
  pool = [...pool, "č"];
  units.push(buildStandardUnit({
    unitTitle: "Písmeno Č",
    unitOrder: 3,
    slugPrefix: "s6u3",
    newLetters: ["č"],
    allKnown: pool,
    sentences: SENTENCES_DIAC_C,
    sentenceStartIdx: 0,
    wpmRange: [67, 82],
    accRange: [86, 91],
  }));

  // Unit 4: ř
  pool = [...pool, "ř"];
  units.push(buildStandardUnit({
    unitTitle: "Písmeno Ř",
    unitOrder: 4,
    slugPrefix: "s6u4",
    newLetters: ["ř"],
    allKnown: pool,
    sentences: SENTENCES_DIAC_RZ,
    sentenceStartIdx: 0,
    wpmRange: [68, 83],
    accRange: [86, 92],
  }));

  // Unit 5: ž
  pool = [...pool, "ž"];
  units.push(buildStandardUnit({
    unitTitle: "Písmeno Ž",
    unitOrder: 5,
    slugPrefix: "s6u5",
    newLetters: ["ž"],
    allKnown: pool,
    sentences: SENTENCES_DIAC_RZ,
    sentenceStartIdx: 2,
    wpmRange: [69, 84],
    accRange: [87, 92],
  }));

  // Unit 6: ý
  pool = [...pool, "ý"];
  units.push(buildStandardUnit({
    unitTitle: "Písmeno Ý",
    unitOrder: 6,
    slugPrefix: "s6u6",
    newLetters: ["ý"],
    allKnown: pool,
    sentences: SENTENCES_DIAC_Y,
    sentenceStartIdx: 0,
    wpmRange: [70, 85],
    accRange: [87, 92],
  }));

  // Unit 7: á
  pool = [...pool, "á"];
  units.push(buildStandardUnit({
    unitTitle: "Písmeno Á",
    unitOrder: 7,
    slugPrefix: "s6u7",
    newLetters: ["á"],
    allKnown: pool,
    sentences: SENTENCES_DIAC_A,
    sentenceStartIdx: 0,
    wpmRange: [71, 86],
    accRange: [87, 92],
  }));

  // Unit 8: í
  pool = [...pool, "í"];
  units.push(buildStandardUnit({
    unitTitle: "Písmeno Í",
    unitOrder: 8,
    slugPrefix: "s6u8",
    newLetters: ["í"],
    allKnown: pool,
    sentences: SENTENCES_DIAC_I,
    sentenceStartIdx: 0,
    wpmRange: [72, 87],
    accRange: [88, 93],
  }));

  // Unit 9: é
  pool = [...pool, "é"];
  units.push(buildStandardUnit({
    unitTitle: "Písmeno É",
    unitOrder: 9,
    slugPrefix: "s6u9",
    newLetters: ["é"],
    allKnown: pool,
    sentences: SENTENCES_DIAC_EE,
    sentenceStartIdx: 0,
    wpmRange: [73, 88],
    accRange: [88, 93],
  }));

  // Unit 10: Review
  units.push(buildReviewUnit({
    unitTitle: "Opakování háčků a čárek",
    unitOrder: 10,
    slugPrefix: "s6u10",
    allKnown: pool,
    sentences: SENTENCES_FULL_DIAC,
    wpm: 88,
    acc: 93,
    lessonCount: 6,
  }));

  return {
    title: "Háčky a čárky",
    order: 6,
    units,
  };
}

export const POOL_AFTER_S6 = [
  ...POOL_AFTER_S5, "ě", "š", "č", "ř", "ž", "ý", "á", "í", "é",
];
