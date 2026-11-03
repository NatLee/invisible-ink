import { describe, expect, it } from "vitest";
import { applyHomoglyph, type HomoglyphStrength } from "./homoglyph";
import { seededRandom } from "./text";

const STRENGTHS: HomoglyphStrength[] = ["minimal", "medium", "full"];

describe("applyHomoglyph", () => {
  it("returns empty input unchanged", () => {
    for (const strength of STRENGTHS) expect(applyHomoglyph("", strength)).toBe("");
  });

  it("leaves digits, punctuation and CJK alone", () => {
    for (const strength of STRENGTHS)
      expect(applyHomoglyph("123 !?。中文", strength)).toBe("123 !?。中文");
  });

  it("only touches a, e, o (and capitals) in minimal mode", () => {
    for (let i = 0; i < 50; i++) {
      const out = applyHomoglyph("abcdefghijklmnopqrstuvwxyz", "minimal");
      const changed = Array.from("abcdefghijklmnopqrstuvwxyz").filter((c, j) => out[j] !== c);
      expect(changed).toEqual(["a", "e", "o"]);
    }
  });

  it("replaces every mapped letter with a non-Latin character", () => {
    const out = applyHomoglyph("aeoAEO", "minimal");
    expect(out).toMatch(/^[^\x00-\x7F]{6}$/);
  });
});

/** Every substitute each letter can get (sampled), for one strength. */
function substitutes(strength: HomoglyphStrength): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const letter of "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ") {
    const seen = new Set<string>();
    for (let i = 0; i < 100; i++) seen.add(applyHomoglyph(letter, strength));
    seen.delete(letter);
    if (seen.size) out[letter] = [...seen].sort();
  }
  return out;
}

describe("applyHomoglyph lookalikes", () => {
  // Each pair below is listed in Unicode confusables.txt (UTS #39), version 18.0.0.
  const FULL: Record<string, string[]> = {
    a: ["\u03B1", "\u0430"], c: ["\u03F2", "\u0441"], e: ["\u0435"], o: ["\u03BF", "\u043E"],
    p: ["\u0440"], r: ["\u0433"], s: ["\u0455"], u: ["\u03C5"], v: ["\u03BD"], w: ["\u051D"],
    x: ["\u0445"], y: ["\u0443"],
    A: ["\u0391", "\u0410"], B: ["\u0392", "\u0412"], C: ["\u03F9", "\u0421"], E: ["\u0395", "\u0415"],
    H: ["\u0397", "\u041D"], K: ["\u039A", "\u041A"], M: ["\u039C", "\u041C"], O: ["\u039F", "\u041E"],
    P: ["\u03A1", "\u0420"], S: ["\u0405"], T: ["\u03A4", "\u0422"], X: ["\u03A7", "\u0425"],
    Y: ["\u03A5", "\u0423"],
  };

  it("uses only the reviewed lookalikes in full mode", () => {
    expect(substitutes("full")).toEqual(FULL);
  });

  it("replaces the documented letters in each mode", () => {
    expect(Object.keys(substitutes("minimal")).join("")).toBe("aeoAEO");
    expect(Object.keys(substitutes("medium")).join("")).toBe("aceoprsxyACEKOPSXY");
  });

  it("replaces everything a weaker strength replaces, and more", () => {
    const [minimal, medium, full] = STRENGTHS.map((s) => Object.keys(substitutes(s)));
    expect(medium).toEqual(expect.arrayContaining(minimal));
    expect(full).toEqual(expect.arrayContaining(medium));
    expect(full.length).toBeGreaterThan(medium.length);
    expect(medium.length).toBeGreaterThan(minimal.length);
  });

  it("never swaps in a letter that reads as something else", () => {
    // These used to be produced: w -> "вв" (reads BB), n -> н (small-caps H) or ν (v),
    // v -> в (small-caps B), y -> υ (u), C -> lowercase ϲ, e -> ε, k -> к/κ, x -> χ.
    const out = applyHomoglyph("wnvyCekx".repeat(50), "full");
    expect(out).not.toMatch(/[\u0432\u043D\u03C5\u03F2\u03B5\u043A\u03BA\u03C7]/);
    expect(out).toMatch(/^(?:[\u051Dn\u03BD\u0443\u0421\u03F9\u0435k\u0445]{8})+$/);
  });

  it("keeps the length and the letter case", () => {
    const text = "The Quick Brown Fox Jumps Over The Lazy Dog";
    for (let i = 0; i < 50; i++) {
      const out = applyHomoglyph(text, "full");
      expect(out).toHaveLength(text.length);
      Array.from(out).forEach((c, j) => {
        const orig = text[j];
        if (orig === orig.toUpperCase()) expect(c).toBe(c.toUpperCase());
        else expect(c).toBe(c.toLowerCase());
      });
    }
  });

  it("is repeatable with the same random source", () => {
    expect(applyHomoglyph("Hello world", "full", seededRandom(5))).toBe(applyHomoglyph("Hello world", "full", seededRandom(5)));
  });
});
