/**
 * Maps every typeable character to its Czech finger description.
 * Used by the new-letter game mode to tell the user which finger to use.
 */

export const FINGER_DESCRIPTIONS: Record<string, string> = {
  // Home row — left hand
  'a': 'levým malíčkem',
  's': 'levým prsteníčkem',
  'd': 'levým prostředníčkem',
  'f': 'levým ukazováčkem',
  'g': 'levým ukazováčkem',

  // Home row — right hand
  'h': 'pravým ukazováčkem',
  'j': 'pravým ukazováčkem',
  'k': 'pravým prostředníčkem',
  'l': 'pravým prsteníčkem',
  'ů': 'pravým malíčkem',

  // Top row — left hand
  'q': 'levým malíčkem',
  'w': 'levým prsteníčkem',
  'e': 'levým prostředníčkem',
  'r': 'levým ukazováčkem',
  't': 'levým ukazováčkem',

  // Top row — right hand
  'z': 'pravým ukazováčkem',
  'u': 'pravým ukazováčkem',
  'i': 'pravým prostředníčkem',
  'o': 'pravým prsteníčkem',
  'p': 'pravým malíčkem',

  // Bottom row — left hand
  'y': 'levým malíčkem',
  'x': 'levým prsteníčkem',
  'c': 'levým prostředníčkem',
  'v': 'levým ukazováčkem',
  'b': 'levým ukazováčkem',

  // Bottom row — right hand
  'n': 'pravým ukazováčkem',
  'm': 'pravým ukazováčkem',
  ',': 'pravým prostředníčkem',
  '.': 'pravým prsteníčkem',
  '-': 'pravým malíčkem',

  // Number row diacritics (unshifted)
  'ě': 'levým prostředníčkem',
  'š': 'levým ukazováčkem',
  'č': 'levým ukazováčkem',
  'ř': 'pravým ukazováčkem',
  'ž': 'pravým ukazováčkem',
  'ý': 'pravým prostředníčkem',
  'á': 'pravým prsteníčkem',
  'í': 'pravým malíčkem',
  'é': 'pravým malíčkem',

  // Special characters (accessed via shift)
  'ú': 'pravým malíčkem',
  '?': 'pravým prostředníčkem',
  '!': 'pravým malíčkem',

  // Composed diacritics (using dead keys: ˇ then letter)
  'ď': 'pravým prostředníčkem',
  'ť': 'levým ukazováčkem',
  'ň': 'pravým ukazováčkem',
  'ó': 'pravým prsteníčkem',

  // Numbers (shifted number row)
  '1': 'levým malíčkem',
  '2': 'levým prostředníčkem',
  '3': 'levým ukazováčkem',
  '4': 'levým ukazováčkem',
  '5': 'pravým ukazováčkem',
  '6': 'pravým ukazováčkem',
  '7': 'pravým prostředníčkem',
  '8': 'pravým prsteníčkem',
  '9': 'pravým malíčkem',
  '0': 'pravým malíčkem',

  // Space
  ' ': 'palcem',
};
