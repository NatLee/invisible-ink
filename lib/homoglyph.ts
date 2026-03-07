/**
 * Homoglyph substitution: replace Latin letters with visually similar
 * Cyrillic/Greek characters. Hard to reverse without a mapping table.
 */

export type HomoglyphStrength = "minimal" | "medium" | "full";

/** Latin → list of lookalikes (Cyrillic/Greek). We pick one per replacement. */
const HOMOGLYPH_MAP: Record<string, string[]> = {
  a: ["\u0430", "\u03B1"], // Cyrillic a, Greek alpha
  e: ["\u0435", "\u03B5"], // Cyrillic e, Greek epsilon
  o: ["\u043E", "\u03BF"], // Cyrillic o, Greek omicron
  p: ["\u0440"],         // Cyrillic r (looks like p)
  c: ["\u0441", "\u03F2"], // Cyrillic s, Greek lunate sigma
  x: ["\u0445", "\u03C7"], // Cyrillic kh, Greek chi
  y: ["\u0443", "\u03C5"], // Cyrillic u, Greek upsilon
  k: ["\u043A", "\u03BA"], // Cyrillic k, Greek kappa
  n: ["\u043D", "\u03BD"], // Cyrillic n, Greek nu
  r: ["\u0433"],         // Cyrillic g (looks like r)
  s: ["\u0455"],         // Cyrillic s (different)
  u: ["\u03C5"],         // Greek upsilon
  v: ["\u03BD", "\u0432"], // Greek nu, Cyrillic v
  w: ["\u0432\u0432"],   // vv lookalike (simplified: use one char)
  A: ["\u0410", "\u0391"], // Cyrillic A, Greek Alpha
  B: ["\u0412", "\u0392"], // Cyrillic V, Greek Beta
  E: ["\u0415", "\u0395"], // Cyrillic E, Greek Epsilon
  K: ["\u041A", "\u039A"], // Cyrillic K, Greek Kappa
  M: ["\u041C", "\u039C"], // Cyrillic M, Greek Mu
  H: ["\u041D", "\u0397"], // Cyrillic N, Greek Eta
  O: ["\u041E", "\u039F"], // Cyrillic O, Greek Omicron
  P: ["\u0420", "\u03A1"], // Cyrillic R, Greek Rho
  C: ["\u0421", "\u03F2"], // Cyrillic S, Greek lunate sigma
  T: ["\u0422", "\u03A4"], // Cyrillic T, Greek Tau
  X: ["\u0425", "\u03A7"], // Cyrillic Kh, Greek Chi
  Y: ["\u0423", "\u03A5"], // Cyrillic U, Greek Upsilon
};

/** Subset for minimal: only a, e, o (common and readable). */
const MINIMAL_KEYS = ["a", "e", "o", "A", "E", "O"];
/** Medium: add c, x, y, k, p, r, s. */
const MEDIUM_KEYS = [
  ...MINIMAL_KEYS,
  "c", "x", "y", "k", "p", "r", "s",
  "C", "X", "Y", "K", "P", "R", "S",
];

function getKeys(strength: HomoglyphStrength): string[] {
  if (strength === "minimal") return MINIMAL_KEYS;
  if (strength === "medium") return MEDIUM_KEYS;
  return Object.keys(HOMOGLYPH_MAP);
}

/**
 * Replaces Latin characters with homoglyphs. Each occurrence may be replaced
 * with a random choice from the lookalike list (for same letter, we use
 * consistent index by position to avoid hydration mismatch if needed — here we
 * use random for obfuscation).
 */
export function applyHomoglyph(
  text: string,
  strength: HomoglyphStrength
): string {
  if (!text) return text;
  const keys = getKeys(strength);
  const map = keys.reduce(
    (acc, key) => {
      const list = HOMOGLYPH_MAP[key];
      if (list) acc[key] = list;
      return acc;
    },
    {} as Record<string, string[]>
  );

  return text
    .split("")
    .map((c) => {
      const choices = map[c];
      if (!choices || choices.length === 0) return c;
      return choices[Math.floor(Math.random() * choices.length)];
    })
    .join("");
}
