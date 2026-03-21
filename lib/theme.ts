/** Shared theme constants mirroring CSS @theme variables.
 *  Used where CSS var() isn't supported (e.g. framer-motion animate props). */
export const theme = {
  green: "#58cc02",
  greenDark: "#46a302",
  blue: "#1cb0f6",
  blueDark: "#1899d6",
  red: "#ff4b4b",
  redDark: "#d33131",
  purple: "#ce82ff",
  purpleDark: "#af52de",
  yellow: "#ffc800",
  yellowDark: "#e5a500",
  blueLight: "#ddf4ff",
  gray: "#e5e5e5",
  grayDark: "#afafaf",
  text: "#4b4b4b",
  white: "#ffffff",
  surface: "#f7f7f7",
} as const;

export const UNIT_COLORS = [
  theme.green,
  theme.blue,
  theme.red,
  theme.purple,
  theme.yellow,
] as const;

export const UNIT_COLORS_DARK = [
  theme.greenDark,
  theme.blueDark,
  theme.redDark,
  theme.purpleDark,
  theme.yellowDark,
] as const;
