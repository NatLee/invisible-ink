import { describe, expect, it } from "vitest";
import { applyHomoglyph, type HomoglyphStrength } from "./homoglyph";

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
