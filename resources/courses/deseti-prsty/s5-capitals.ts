/**
 * Section 5: Velká písmena (Capitals / Shift)
 * Teaches Shift usage with left/right hand
 * 3 units, ~17 lessons
 */
import {
  buildStandardUnit,
  buildReviewUnit,
  copyingLesson,
  type SectionDef,
  type UnitDef,
  type LessonDef,
  letterDrillLesson,
  rainingLesson,
} from "./helpers";
import { SENTENCES_CAPS } from "../../vocabulary";
import { POOL_AFTER_S4 } from "./s4-bottom-row";

// Capital letters — left hand side (right Shift to type)
const CAPS_LEFT = ["A", "S", "D", "F", "G", "Q", "W", "E", "R", "T", "Y", "X", "C", "V", "B"];
// Capital letters — right hand side (left Shift to type)
const CAPS_RIGHT = ["H", "J", "K", "L", "Z", "U", "I", "O", "P", "N", "M"];

export function buildSection5(): SectionDef {
  const pool = [...POOL_AFTER_S4];
  const units: UnitDef[] = [];

  // Unit 1: Left-hand capitals (typed with right Shift)
  {
    const lessons: LessonDef[] = [];
    const newLetters = CAPS_LEFT.slice(0, 6);
    const allWithCaps = [...pool, ...CAPS_LEFT];

    lessons.push(letterDrillLesson(
      newLetters, allWithCaps, 80, 65, 85,
      "s5u1-drill1",
    ));
    lessons.push(rainingLesson(
      newLetters, allWithCaps, 35, 50, 85,
      "s5u1-rain",
    ));
    lessons.push(copyingLesson(
      SENTENCES_CAPS[0], "ignore-mistakes", 50, 85,
      "s5u1-copy1",
    ));
    lessons.push(copyingLesson(
      SENTENCES_CAPS[1], "ignore-mistakes", 52, 86,
      "s5u1-copy2",
    ));
    lessons.push(copyingLesson(
      SENTENCES_CAPS[2] + " " + SENTENCES_CAPS[3],
      "repair-mistake", 54, 87,
      "s5u1-copy3",
    ));
    lessons.push(copyingLesson(
      SENTENCES_CAPS[4] + " " + SENTENCES_CAPS[5],
      "repair-mistake", 56, 88,
      "s5u1-test", "Test", true,
    ));

    units.push({ title: "Shift — levá ruka", order: 1, lessons });
  }

  // Unit 2: Right-hand capitals (typed with left Shift)
  {
    const lessons: LessonDef[] = [];
    const newLetters = CAPS_RIGHT.slice(0, 6);
    const allWithCaps = [...pool, ...CAPS_LEFT, ...CAPS_RIGHT];

    lessons.push(letterDrillLesson(
      newLetters, allWithCaps, 80, 65, 85,
      "s5u2-drill1",
    ));
    lessons.push(rainingLesson(
      newLetters, allWithCaps, 35, 52, 85,
      "s5u2-rain",
    ));
    lessons.push(copyingLesson(
      SENTENCES_CAPS[6], "ignore-mistakes", 54, 86,
      "s5u2-copy1",
    ));
    lessons.push(copyingLesson(
      SENTENCES_CAPS[7], "repair-mistake", 56, 87,
      "s5u2-copy2",
    ));
    lessons.push(copyingLesson(
      SENTENCES_CAPS[8] + " " + SENTENCES_CAPS[9],
      "repair-mistake", 58, 88,
      "s5u2-test", "Test", true,
    ));

    units.push({ title: "Shift — pravá ruka", order: 2, lessons });
  }

  // Unit 3: Review — full sentences with caps
  units.push(buildReviewUnit({
    unitTitle: "Věty s velkými písmeny",
    unitOrder: 3,
    slugPrefix: "s5u3",
    allKnown: [...pool, ...CAPS_LEFT, ...CAPS_RIGHT],
    sentences: SENTENCES_CAPS,
    wpm: 65,
    acc: 92,
    lessonCount: 6,
  }));

  return {
    title: "Velká písmena",
    order: 5,
    units,
  };
}

export const POOL_AFTER_S5 = [...POOL_AFTER_S4, ...CAPS_LEFT, ...CAPS_RIGHT];
