/**
 * Homoglyph substitution: replace Latin letters with visually similar
 * Cyrillic/Greek characters. Hard to reverse without a mapping table.
 */

import type { RandomSource } from "./text";

export type HomoglyphStrength = "minimal" | "medium" | "full";

/** Strengths from weakest to strongest; each one also replaces everything the weaker ones do. */
const STRENGTHS: readonly HomoglyphStrength[] = ["minimal", "medium", "full"];

/**
 * Latin letter → the weakest strength that replaces it, and its lookalikes
 * (Cyrillic/Greek). Each occurrence gets one lookalike picked at random.
 *
 * Every pair here is listed in Unicode's confusables.txt (the UTS #39
 * security data that browsers use to catch spoofed domain names), so the
 * substitute really reads as the same letter. Letters without a listed
 * lookalike (k, n, R, …) are left alone rather than swapped for something
 * that only looks similar in some fonts. Keeping the strength on the entry
 * means a strength can't name a letter that has no lookalike.
 */
const LOOKALIKES: Record<string, { from: HomoglyphStrength; chars: string[] }> = {
  a: { from: "minimal", chars: ["\u0430", "\u03B1"] },  // Cyrillic a, Greek alpha
  e: { from: "minimal", chars: ["\u0435"] },            // Cyrillic ie
  o: { from: "minimal", chars: ["\u043E", "\u03BF"] },  // Cyrillic o, Greek omicron
  p: { from: "medium", chars: ["\u0440"] },             // Cyrillic er
  c: { from: "medium", chars: ["\u0441", "\u03F2"] },   // Cyrillic es, Greek lunate sigma
  x: { from: "medium", chars: ["\u0445"] },             // Cyrillic ha
  y: { from: "medium", chars: ["\u0443"] },             // Cyrillic u
  r: { from: "medium", chars: ["\u0433"] },             // Cyrillic ghe
  s: { from: "medium", chars: ["\u0455"] },             // Cyrillic dze
  u: { from: "full", chars: ["\u03C5"] },               // Greek upsilon
  v: { from: "full", chars: ["\u03BD"] },               // Greek nu
  w: { from: "full", chars: ["\u051D"] },               // Cyrillic we
  A: { from: "minimal", chars: ["\u0410", "\u0391"] },  // Cyrillic A, Greek Alpha
  B: { from: "full", chars: ["\u0412", "\u0392"] },     // Cyrillic Ve, Greek Beta
  C: { from: "medium", chars: ["\u0421", "\u03F9"] },   // Cyrillic Es, Greek capital lunate sigma
  E: { from: "minimal", chars: ["\u0415", "\u0395"] },  // Cyrillic Ie, Greek Epsilon
  H: { from: "full", chars: ["\u041D", "\u0397"] },     // Cyrillic En, Greek Eta
  K: { from: "medium", chars: ["\u041A", "\u039A"] },   // Cyrillic Ka, Greek Kappa
  M: { from: "full", chars: ["\u041C", "\u039C"] },     // Cyrillic Em, Greek Mu
  O: { from: "minimal", chars: ["\u041E", "\u039F"] },  // Cyrillic O, Greek Omicron
  P: { from: "medium", chars: ["\u0420", "\u03A1"] },   // Cyrillic Er, Greek Rho
  S: { from: "medium", chars: ["\u0405"] },             // Cyrillic Dze
  T: { from: "full", chars: ["\u0422", "\u03A4"] },     // Cyrillic Te, Greek Tau
  X: { from: "medium", chars: ["\u0425", "\u03A7"] },   // Cyrillic Ha, Greek Chi
  Y: { from: "medium", chars: ["\u0423", "\u03A5"] },   // Cyrillic U, Greek Upsilon
};

/** For each strength, the letters it replaces and their lookalikes. */
const TABLES = Object.fromEntries(
  STRENGTHS.map((strength, rank) => [
    strength,
    new Map(
      Object.entries(LOOKALIKES)
        .filter(([, entry]) => STRENGTHS.indexOf(entry.from) <= rank)
        .map(([letter, entry]) => [letter, entry.chars])
    ),
  ])
) as Record<HomoglyphStrength, Map<string, string[]>>;

/**
 * Replaces Latin characters with homoglyphs. Each occurrence gets a random
 * choice from its lookalike list. Every substitute is one character, so the
 * length never changes. (Splitting by UTF-16 unit is fine here: every letter
 * in the table is a single unit, so an emoji's halves never match and are
 * joined back unchanged.)
 */
export function applyHomoglyph(
  text: string,
  strength: HomoglyphStrength,
  random: RandomSource = Math.random
): string {
  if (!text) return text;
  const table = TABLES[strength];

  return text
    .split("")
    .map((c) => {
      const choices = table.get(c);
      if (!choices) return c;
      return choices[Math.floor(random() * choices.length)];
    })
    .join("");
}
