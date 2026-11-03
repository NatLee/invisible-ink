/**
 * Homoglyph substitution: replace Latin letters with visually similar
 * Cyrillic/Greek characters. Hard to reverse without a mapping table.
 */

import type { RandomSource } from "./text";

export type HomoglyphStrength = "minimal" | "medium" | "full";

/**
 * Latin → list of lookalikes (Cyrillic/Greek). We pick one per replacement.
 *
 * Every pair here is listed in Unicode's confusables.txt (the UTS #39
 * security data that browsers use to catch spoofed domain names), so the
 * substitute really reads as the same letter. Letters without a listed
 * lookalike (k, n, R, …) are left alone rather than swapped for something
 * that only looks similar in some fonts.
 */
const HOMOGLYPH_MAP: Record<string, string[]> = {
  a: ["\u0430", "\u03B1"], // Cyrillic a, Greek alpha
  e: ["\u0435"],           // Cyrillic ie
  o: ["\u043E", "\u03BF"], // Cyrillic o, Greek omicron
  p: ["\u0440"],           // Cyrillic er
  c: ["\u0441", "\u03F2"], // Cyrillic es, Greek lunate sigma
  x: ["\u0445"],           // Cyrillic ha
  y: ["\u0443"],           // Cyrillic u
  r: ["\u0433"],           // Cyrillic ghe
  s: ["\u0455"],           // Cyrillic dze
  u: ["\u03C5"],           // Greek upsilon
  v: ["\u03BD"],           // Greek nu
  w: ["\u051D"],           // Cyrillic we
  A: ["\u0410", "\u0391"], // Cyrillic A, Greek Alpha
  B: ["\u0412", "\u0392"], // Cyrillic Ve, Greek Beta
  C: ["\u0421", "\u03F9"], // Cyrillic Es, Greek capital lunate sigma
  E: ["\u0415", "\u0395"], // Cyrillic Ie, Greek Epsilon
  H: ["\u041D", "\u0397"], // Cyrillic En, Greek Eta
  K: ["\u041A", "\u039A"], // Cyrillic Ka, Greek Kappa
  M: ["\u041C", "\u039C"], // Cyrillic Em, Greek Mu
  O: ["\u041E", "\u039F"], // Cyrillic O, Greek Omicron
  P: ["\u0420", "\u03A1"], // Cyrillic Er, Greek Rho
  S: ["\u0405"],           // Cyrillic Dze
  T: ["\u0422", "\u03A4"], // Cyrillic Te, Greek Tau
  X: ["\u0425", "\u03A7"], // Cyrillic Ha, Greek Chi
  Y: ["\u0423", "\u03A5"], // Cyrillic U, Greek Upsilon
};

/** Subset for minimal: only a, e, o (common and readable). */
const MINIMAL_KEYS = ["a", "e", "o", "A", "E", "O"];
/** Medium: add c, p, r, s, x, y. */
const MEDIUM_KEYS = [
  ...MINIMAL_KEYS,
  "c", "p", "r", "s", "x", "y",
  "C", "K", "P", "S", "X", "Y",
];

function getKeys(strength: HomoglyphStrength): string[] {
  if (strength === "minimal") return MINIMAL_KEYS;
  if (strength === "medium") return MEDIUM_KEYS;
  return Object.keys(HOMOGLYPH_MAP);
}

/**
 * Replaces Latin characters with homoglyphs. Each occurrence gets a random
 * choice from its lookalike list. Every substitute is one character, so the
 * length never changes.
 */
export function applyHomoglyph(
  text: string,
  strength: HomoglyphStrength,
  random: RandomSource = Math.random
): string {
  if (!text) return text;
  const keys = new Set(getKeys(strength));

  return text
    .split("")
    .map((c) => {
      const choices = keys.has(c) ? HOMOGLYPH_MAP[c] : undefined;
      if (!choices) return c;
      return choices[Math.floor(random() * choices.length)];
    })
    .join("");
}
