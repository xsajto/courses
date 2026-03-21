/**
 * "Deseti prsty" — a complete touch-typing course for Czech keyboard.
 * ~300 lessons across 8 sections.
 */
import { resetLessonOrder } from "./helpers";
import { buildSection1 } from "./s1-home-row";
import { buildSection2 } from "./s2-vowels";
import { buildSection3 } from "./s3-top-row";
import { buildSection4 } from "./s4-bottom-row";
import { buildSection5 } from "./s5-capitals";
import { buildSection6 } from "./s6-diacritics";
import { buildSection7 } from "./s7-special";
import { buildSection8 } from "./s8-mastery";
import { buildSection9 } from "./s9-practice";

function buildCourse() {
  // Reset the global lesson counter so slugs are consistent
  resetLessonOrder();

  const sections = [
    buildSection1(),
    buildSection2(),
    buildSection3(),
    buildSection4(),
    buildSection5(),
    buildSection6(),
    buildSection7(),
    buildSection8(),
  ];

  return {
    slug: "deseti-prsty",
    title: "Deseti prsty",
    description: "Kompletní kurz psaní deseti prsty na české klávesnici. Od domácí řady až po 100 úderů za minutu.",
    type: "TYPING" as const,
    sections,
  };
}

export const desetiPrstyCourse = buildCourse();
