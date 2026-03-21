/**
 * Czech vocabulary for generating typing practice content.
 * Words are organized by tiers matching the course progression.
 */

// ── Tiered word lists ────────────────────────────────────────────────

/** Tier 0: Home row only — f, j, d, k, s, l, a, ů, g, h */
export const WORDS_HOME: string[] = [
  "dal", "had", "las", "sad", "lag", "gas", "gal", "ask",
  "halda", "salsa", "saga", "skla", "skald", "flask",
  "alfa", "half", "slash", "kjdas", "laksa",
];

/** Tier 1: Home row + space (real Czech words possible) */
export const WORDS_HOME_SPACE: string[] = [
  "dal", "had", "sad", "las", "halda", "salsa", "skald",
  "alfa", "half", "slag", "flask", "dlaž", "galask",
];

/** Tier 2: + e */
export const WORDS_E: string[] = [
  "led", "les", "let", "dle", "hesla", "sled", "jed", "dek",
  "deska", "lehkej", "jefe", "hele", "kefal", "sekal",
  "dekl", "fesk", "segal", "flek", "lesk",
];

/** Tier 3: + i */
export const WORDS_I: string[] = [
  "dis", "fil", "lid", "lis", "jis", "kli", "sli", "silk",
  "dile", "file", "side", "kise", "fidel", "gilds",
  "ligas", "dikes", "filed", "liked", "hides",
];

/** Tier 4: + o */
export const WORDS_O: string[] = [
  "kol", "los", "lod", "ode", "dole", "hole", "kolo", "solo",
  "pole", "jode", "okolo", "logos", "sokel", "osel",
  "hosel", "odes", "losed", "ohelds", "doles",
];

/** Tier 5: + u */
export const WORDS_U: string[] = [
  "duh", "sud", "luk", "kus", "ruka", "duše", "lusk",
  "hulk", "kufr", "sluj", "uhel", "uhol", "kufe",
  "sluha", "fugas", "kusel", "dulse",
];

/** Tier 6: + r, z (top row consonants batch 1) */
export const WORDS_RZ: string[] = [
  "roz", "rez", "rize", "roz", "zrak", "zroj",
  "drze", "hrozí", "kriz", "roze",
  "rizek", "zdroj", "rozhodl", "rozsel",
];

/** Tier 7: + t, w */
export const WORDS_TW: string[] = [
  "tak", "let", "jest", "list", "tisk", "slet", "kost",
  "test", "trest", "stojí", "stolí", "stádo",
  "twist", "wist",
];

/** Tier 8: + p, q */
export const WORDS_PQ: string[] = [
  "pes", "pod", "pole", "plot", "popis", "posed", "pilot",
  "posel", "potok", "sport", "spoj", "stop", "strop",
  "topol", "opel", "kopie", "pokles",
];

/** Tier 9: + n, m (bottom row batch 1) */
export const WORDS_NM: string[] = [
  "den", "ven", "jen", "modul", "med", "men", "most",
  "nem", "ním", "mne", "mast", "strom", "dnem",
  "mnoho", "mlok", "nomen", "moment",
];

/** Tier 10: + v, b */
export const WORDS_VB: string[] = [
  "vlk", "bok", "boj", "buk", "bod", "blok", "bota",
  "vlast", "vstup", "vest", "ven", "voda", "volba",
  "brzo", "brod", "vlevo", "vpravo",
];

/** Tier 11: + c, x */
export const WORDS_CX: string[] = [
  "cena", "cesta", "cvak", "akce", "lekce", "funkce",
  "text", "index", "pixel", "flex", "export", "extra",
  "centrum", "koncept", "context",
];

/** Tier 12: + y */
export const WORDS_Y: string[] = [
  "typ", "byly", "tyto", "byt", "syn", "syt", "mys",
  "symbol", "systém", "city", "byty", "ryby",
  "yeti", "myslet", "byste",
];

/** Full alphabet without diacritics */
export const WORDS_FULL: string[] = [
  "a", "i", "o", "u", "k", "v", "s", "z", "do", "je", "se",
  "na", "to", "si", "od", "po", "za", "pro", "ale", "tak",
  "ten", "den", "rok", "kdo", "jak", "tam", "pak", "nic",
  "jen", "dva", "pod", "nad", "bez", "ven", "sem", "hle",
  "ano", "sto", "let", "lid",
  "auto", "bude", "cena", "cesta", "den", "deset", "doma",
  "jeden", "jejich", "jako", "jsem", "jsou", "kde", "kdo",
  "krok", "kus", "let", "lide", "list", "mezi", "misto",
  "mit", "mohou", "musit", "noc", "novy",
  "oblast", "osud", "otec", "plan", "plot", "pod", "pole",
  "pomoc", "potom", "prst", "ples", "rada", "rok",
  "ruka", "sem", "slovo", "sport", "strom", "sud",
  "svit", "text", "vlak", "vlast", "voda", "volba",
  "vrch", "vstup", "zima", "kolo", "most", "pero", "bota",
  "dopis", "hotel", "kolej", "kotel", "motor", "pokus",
  "potok", "pozor", "srdce", "test", "trest",
  "student", "klient", "efekt", "projekt", "produkt",
  "kredit", "koncept", "kontext", "doktor", "dokument",
  "element", "import", "komplex",
];

/** Words with diacritics — ě */
export const WORDS_DIAC_E: string[] = [
  "děti", "měsíc", "město", "světlo", "věc", "něco", "někdo",
  "věda", "běh", "věk", "děj", "lev", "země", "směr",
  "svět", "změna", "oběd", "dělo",
];

/** Words with diacritics — š */
export const WORDS_DIAC_S: string[] = [
  "škola", "šest", "šance", "široký", "špatný", "šéf",
  "šťastný", "štěstí", "šedý", "šátek", "pošta",
  "košile", "šunka", "švestka",
];

/** Words with diacritics — č */
export const WORDS_DIAC_C: string[] = [
  "čas", "část", "člověk", "článek", "často", "české", "číslo",
  "čaj", "čelo", "čin", "oči", "noc", "práče",
  "učitel", "počet", "ručník",
];

/** Words with diacritics — ř, ž */
export const WORDS_DIAC_RZ: string[] = [
  "říkat", "řada", "řeč", "řeka", "říše", "třída", "příklad",
  "žena", "život", "žák", "též", "můžete", "každý",
  "řídit", "řezat", "žízeň", "běžet", "držet",
];

/** Words with diacritics — ý */
export const WORDS_DIAC_Y: string[] = [
  "dobrý", "nový", "první", "malý", "velký", "celý", "jiný",
  "starý", "mladý", "bílý", "černý", "krásný",
  "dobrý", "každý", "žádný", "plný", "dlouhý",
];

/** Words with diacritics — á */
export const WORDS_DIAC_A: string[] = [
  "zákon", "zájem", "práce", "stát", "málo", "dávno", "známý",
  "zápas", "váha", "pátek", "správa", "zpráva", "otázka",
  "dálka", "hádat", "láska", "máma", "táta",
];

/** Words with diacritics — í */
export const WORDS_DIAC_I: string[] = [
  "příliš", "stříbro", "písmeno", "přítel", "příběh",
  "říjen", "místnost", "většina", "číslo", "písmo",
  "bílý", "líný", "tíha", "síla", "víra",
];

/** Words with diacritics — é */
export const WORDS_DIAC_EE: string[] = [
  "léto", "médium", "éra", "téma", "scéna",
  "veselé", "krásné", "české", "velké", "malé",
  "dobré", "nové", "staré", "celé",
];

/** Words with diacritics — ú */
export const WORDS_DIAC_U: string[] = [
  "účet", "úkol", "úspěch", "úplně", "ústav",
  "únor", "úvod", "území", "úsek", "útok", "úrok",
];

/** Words with ď, ť, ň */
export const WORDS_DIAC_DTN: string[] = [
  "loď", "zeď", "měď", "hruď",
  "paměť", "oběť", "síť",
  "píseň", "báseň", "laň", "daň", "skříň",
  "ďábel", "ťukat", "ňouma",
];

// ── Curated Czech sentences by tier ─────────────────────────────────

/** Sentences using only home row + space */
export const SENTENCES_HOME: string[] = [
  "dal salsa flash",
  "hadsal lagask",
  "alfa flask halda",
  "gal ska half dal",
  "salsalag gas flask",
  "skald half alfa",
  "had halda gal slag",
  "dal ask gas flask half",
];

/** Sentences after adding e */
export const SENTENCES_E: string[] = [
  "hele led deska lesk",
  "flek sekal hesla jed",
  "les led hele jede dal",
  "deska lesk flek sekal",
  "hele led jede lesk des",
  "sled hele flek deska les",
];

/** Sentences after adding i */
export const SENTENCES_I: string[] = [
  "lid file dile silk hides",
  "filed liked silk side lid",
  "dis fil lid side gilds",
  "file silk dile side hides lid",
];

/** Sentences after adding o */
export const SENTENCES_O: string[] = [
  "kolo solo dole hole osel",
  "pole logos okolo sokel dole",
  "hole solo kolo osel pole",
  "dole osel logos hole kolo",
];

/** Sentences after adding u — first real Czech sentences possible */
export const SENTENCES_U: string[] = [
  "kus sud luk duh",
  "sud uhel kufr hulk lusk",
  "duh sluha kus luk sud",
  "uhel lusk sluha kufr duh kus",
];

/** Sentences with top row r, z, t, w, p, q */
export const SENTENCES_TOP: string[] = [
  "test sport pilot topol strop",
  "plot posel potok sport posed",
  "kopie pilot strop topol sport",
  "jest list tisk sport pilot",
  "plot potok posel kopie strop",
  "rizek zdroj sport test pilot",
];

/** Sentences with bottom row n, m, v, b */
export const SENTENCES_BOTTOM_NM: string[] = [
  "den most med strom moment",
  "mlok mnoho mne dnem ven",
  "med most strom den moment",
  "nem men den ven strom most",
];

export const SENTENCES_BOTTOM_VB: string[] = [
  "vlk boj blok bota vlast",
  "vstup vest voda volba brzo",
  "brod vlevo bod bok vlast",
  "voda bota blok vlk boj",
];

/** Sentences with full lowercase alphabet */
export const SENTENCES_FULL_LOWER: string[] = [
  "student klient efekt projekt produkt kredit",
  "koncept kontext doktor dokument element import",
  "kolo most pero bota dopis hotel kolej motor",
  "jeden rok den let sem tam pak jen dva pod",
  "sport test vlak auto strom bude cena cesta",
  "pomoc rada slovo pole plot vstup vrch volba",
  "oblast osud otec plan ruka krok kus deset",
  "pozor pokus potok srdce trest student vlast",
];

/** Sentences with capitals (Shift practice) */
export const SENTENCES_CAPS: string[] = [
  "Jan jel do Prahy a Pavel do Brna.",
  "Havel a Klaus jsou prezidenti.",
  "Eva a Adam bydli v Praze.",
  "Petr a Josef jdou do lesa.",
  "Alena a Martin jdou na koncert.",
  "Karel a Jitka jsou doktor a sestra.",
  "Filip a Dana jdou na film do kina.",
  "Lucie a Tomas jdou na hotel Praha.",
  "David a Petra bydli v Brne.",
  "Lenka a Vojta jdou do Ostravy.",
];

/** Sentences with diacritics — ě */
export const SENTENCES_DIAC_E: string[] = [
  "Děti jdou ze školy do města.",
  "Měsíc svítí nad celou zemí.",
  "Něco se děje ve světle města.",
  "Směr větru se změnil k severu.",
  "Oběd je na stole, věci jsou ve skříni.",
  "Svět se mění a město roste.",
];

/** Sentences with diacritics — š */
export const SENTENCES_DIAC_S: string[] = [
  "Šest švestek na stole u pošty.",
  "Škola má nového šéfa.",
  "Šedý šátek a košile na šňůře.",
  "Šťastný šéf jde do školy.",
  "Špatná šance na šestku.",
  "Šunka a švestky jsou v košíku.",
];

/** Sentences with diacritics — č */
export const SENTENCES_DIAC_C: string[] = [
  "Člověk často čte článek o českém čaji.",
  "Čas plyne a číslo roste.",
  "Učitel počítá čísla na čele.",
  "Část města je česká.",
  "Oči člověka vidí článek.",
  "Čas a čin jsou české slova.",
];

/** Sentences with diacritics — ř, ž */
export const SENTENCES_DIAC_RZ: string[] = [
  "Řeka teče přes říši a třídou.",
  "Žena říká každý den příklad.",
  "Řídit život není žádná řeč.",
  "Žák běží přes třídu k řece.",
  "Příklad ženy z řady říší.",
  "Každý držet řád a řídit se jím.",
];

/** Sentences with diacritics — ý */
export const SENTENCES_DIAC_Y: string[] = [
  "Dobrý starý dům je velký a krásný.",
  "Nový černý vlak jede do nového města.",
  "Malý bílý pes běží po dlouhé cestě.",
  "Celý první den byl plný práce.",
  "Každý mladý člověk má jiný plán.",
  "Žádný starý strom není malý.",
];

/** Sentences with diacritics — á */
export const SENTENCES_DIAC_A: string[] = [
  "Máma a táta jdou na zápas v pátek.",
  "Správa a zpráva jsou na stole.",
  "Láska a dálka jsou krásná slova.",
  "Zákon a zájem mají váhu.",
  "Otázka práce je dávno známá.",
  "Stát má právo hádat se o zákon.",
];

/** Sentences with diacritics — í */
export const SENTENCES_DIAC_I: string[] = [
  "Příliš bílý a líný přítel.",
  "Stříbro a písmeno jsou v místnosti.",
  "Většina říjnových dnů je tichá.",
  "Síla a víra jsou přílišné.",
  "Příběh o tíze a síle života.",
  "Číslo a písmo jsou základní.",
];

/** Sentences with diacritics — é */
export const SENTENCES_DIAC_EE: string[] = [
  "Veselé české léto na scéně.",
  "Krásné staré médium má téma.",
  "Velké nové město je celé krásné.",
  "Dobré staré české éry jsou pryč.",
  "Malé veselé celé nové léto.",
  "Staré české téma v nové éře.",
];

/** Sentences with diacritics — ú */
export const SENTENCES_DIAC_U: string[] = [
  "Účet za úkol je úplně správný.",
  "Úspěch přišel v únoru z ústavu.",
  "Úvod do území je úplně nový.",
  "Úsek a útok na úrok ústavu.",
  "Únorový úkol přinesl úspěch.",
  "Území kolem ústavu je úplně tiché.",
];

/** Full diacritics sentences */
export const SENTENCES_FULL_DIAC: string[] = [
  "Příliš žluťoučký kůň úpěl ďábelské ódy.",
  "Člověk často říká, že život je krásný.",
  "Škola učí děti číst a psát správně.",
  "Říjen přináší krásné barvy do přírody.",
  "Většina lidí chodí v pátek na zápas.",
  "Každý den přináší novou příležitost.",
  "Žáci čtou články o české přírodě.",
  "Stříbrný měsíc svítí nad městem.",
  "Přítel říká, že příběh je zajímavý.",
  "Účet za úkol je úplně správný.",
];

/** Sentences with numbers */
export const SENTENCES_NUMBERS: string[] = [
  "V roce 1989 se změnil celý svět.",
  "Na stole je 5 knih a 3 sešity.",
  "Adresa je ulice 28. října číslo 15.",
  "Rok má 12 měsíců a 365 dní.",
  "Cena je 250 korun za 1 kus.",
  "Telefon má 9 číslic.",
  "Auto jede 120 km za hodinu.",
  "Je mu 42 let a má 2 děti.",
];

/** Sentences with special punctuation */
export const SENTENCES_PUNCT: string[] = [
  "Kolik to stojí? Nevím, asi 200 korun.",
  "Pozor! Vlak přijíždí na kolej číslo 3.",
  "Jak se máš? Děkuji, dobře.",
  "Ano, souhlasím. Ne, nesouhlasím!",
  "Co říkáš? To je zajímavé!",
  "Praha, Brno, Ostrava - velká města.",
];

/** Speed and fluency sentences (Section 8) */
export const SENTENCES_SPEED: string[] = [
  "Příliš žluťoučký kůň úpěl ďábelské ódy a šťastný člověk četl noviny.",
  "Každý den přináší nové příležitosti pro všechny, kdo se snaží.",
  "Člověk se učí celý život a nikdy není pozdě začít něco nového.",
  "Krásný říjnový den svítil nad městem a lidé šli na procházku.",
  "Většina studentů chodí do školy a učí se psát na klávesnici.",
  "Správné psaní deseti prsty je důležitá dovednost pro každého.",
  "Práce na počítači vyžaduje rychlé a přesné psaní bez chyb.",
  "Účet za telefon přišel v únoru a byl úplně správný.",
  "Žáci se učí psát česky se všemi háčky a čárkami.",
  "Dobrý den, vítejte v kurzu psaní deseti prsty na klávesnici.",
  "Praha je hlavní město České republiky a má více než milion obyvatel.",
  "Řeka Vltava protéká středem Prahy a je nejdelší řekou v Čechách.",
  "Na podzim padají listy ze stromů a dny jsou kratší.",
  "Příběh o třech přátelích, kteří cestovali přes celou zemi.",
  "Školní rok začíná v září a končí v červnu každý rok.",
];

// ── Aggregate word list (used by getWordsForLetters) ────────────────

const WORDS: string[] = [
  ...WORDS_HOME, ...WORDS_HOME_SPACE, ...WORDS_E, ...WORDS_I,
  ...WORDS_O, ...WORDS_U, ...WORDS_RZ, ...WORDS_TW, ...WORDS_PQ,
  ...WORDS_NM, ...WORDS_VB, ...WORDS_CX, ...WORDS_Y, ...WORDS_FULL,
  ...WORDS_DIAC_E, ...WORDS_DIAC_S, ...WORDS_DIAC_C, ...WORDS_DIAC_RZ,
  ...WORDS_DIAC_Y, ...WORDS_DIAC_A, ...WORDS_DIAC_I, ...WORDS_DIAC_EE,
  ...WORDS_DIAC_U, ...WORDS_DIAC_DTN,
];

// ── Helper functions ────────────────────────────────────────────────

/**
 * Returns all words from the vocabulary that can be typed using only the given letters + space.
 */
export function getWordsForLetters(available: string[]): string[] {
  const set = new Set(available);
  return WORDS.filter(word => {
    for (const ch of word) {
      if (ch === ' ') continue;
      if (!set.has(ch)) return false;
    }
    return true;
  });
}

/**
 * Generates a practice sequence of individual letters.
 * Emphasizes new letters (~60%) mixed with known letters (~40%).
 * Uses seeded index for deterministic output.
 */
export function generatePracticeLetters(
  newLetters: string[],
  allKnown: string[],
  count: number,
  seed: number = 0
): string[] {
  const result: string[] = [];
  const oldLetters = allKnown.filter(l => !newLetters.includes(l));

  // Simple seeded pseudo-random
  let s = seed || 42;
  const rand = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return (s >>> 16) / 32768;
  };

  for (let i = 0; i < count; i++) {
    if (oldLetters.length > 0 && rand() > 0.6) {
      result.push(oldLetters[Math.floor(rand() * oldLetters.length)]);
    } else {
      result.push(newLetters[Math.floor(rand() * newLetters.length)]);
    }
  }

  return result;
}

/**
 * Builds practice text from available words.
 * Falls back to letter sequences when few words match.
 * Uses seeded index for deterministic output.
 */
export function generateCopyingText(
  available: string[],
  targetLength: number,
  seed: number = 0
): string {
  const words = getWordsForLetters(available);
  const unique = [...new Set(words)];

  let s = seed || 99;
  const rand = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return (s >>> 16) / 32768;
  };

  if (unique.length < 3) {
    const groups: string[] = [];
    let len = 0;
    while (len < targetLength) {
      const groupLen = 3 + Math.floor(rand() * 3);
      let group = "";
      for (let i = 0; i < groupLen; i++) {
        group += available[Math.floor(rand() * available.length)];
      }
      groups.push(group);
      len += group.length + 1;
    }
    return groups.join(" ");
  }

  const parts: string[] = [];
  let len = 0;
  while (len < targetLength) {
    const word = unique[Math.floor(rand() * unique.length)];
    parts.push(word);
    len += word.length + 1;
  }

  return parts.join(" ");
}

/**
 * Pick a sentence from an array deterministically based on lesson index.
 */
export function pickSentence(sentences: string[], index: number): string {
  return sentences[index % sentences.length];
}

/**
 * Pick and combine multiple sentences to reach a target length.
 */
export function buildText(sentences: string[], startIndex: number, targetLength: number): string {
  const parts: string[] = [];
  let len = 0;
  let i = startIndex;
  while (len < targetLength) {
    const s = sentences[i % sentences.length];
    parts.push(s);
    len += s.length + 1;
    i++;
  }
  return parts.join(" ");
}
