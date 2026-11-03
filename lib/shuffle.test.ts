import { describe, expect, it } from "vitest";
import { shuffleFragments, type ShuffleStrategy } from "./shuffle";

const STRATEGIES: ShuffleStrategy[] = ["word", "sentence", "char-block"];
const sortedChars = (s: string) => Array.from(s).sort().join("");

describe("shuffleFragments", () => {
  it("returns blank input unchanged", () => {
    for (const strategy of STRATEGIES) {
      expect(shuffleFragments("", strategy)).toBe("");
      expect(shuffleFragments("   ", strategy)).toBe("   ");
    }
  });

  it("returns a single fragment unchanged", () => {
    expect(shuffleFragments("hello", "word")).toBe("hello");
    expect(shuffleFragments("abc", "char-block", 3)).toBe("abc");
  });

  it("only reorders: the output uses exactly the same characters", () => {
    const text = "The quick brown fox. Jumps over! The lazy dog?";
    for (const strategy of STRATEGIES)
      for (let i = 0; i < 50; i++)
        expect(sortedChars(shuffleFragments(text, strategy, 3))).toBe(sortedChars(text));
  });

  it("keeps fixed-size blocks intact", () => {
    for (let i = 0; i < 50; i++) {
      const out = shuffleFragments("aaabbbccc", "char-block", 3);
      expect(out.match(/.{3}/g)!.sort()).toEqual(["aaa", "bbb", "ccc"]);
    }
  });
});
