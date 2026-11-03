import { describe, expect, it } from "vitest";
import {
  injectZeroWidth,
  renderInvisibleForInspector,
  type CharType,
  type InjectionMode,
} from "./injector";

const ZWSP = "\u200B";
const ZWNJ = "\u200C";
const ZWJ = "\u200D";
const stripInvisible = (s: string) => s.replace(/[\u200B-\u200D]/g, "");
const MODES: InjectionMode[] = ["interval", "random", "space-only", "url-breaker"];
const CHAR_TYPES: CharType[] = [ZWSP, ZWNJ, ZWJ, "mix"];

describe("injectZeroWidth", () => {
  it("returns empty input unchanged", () => {
    for (const mode of MODES) expect(injectZeroWidth("", mode)).toBe("");
  });

  it("puts one invisible character between every pair of characters (Full Interval)", () => {
    expect(injectZeroWidth("abc", "interval")).toBe(`a${ZWSP}b${ZWSP}c`);
    expect(injectZeroWidth("你好", "interval", ZWNJ)).toBe(`你${ZWNJ}好`);
    expect(injectZeroWidth("x", "interval")).toBe("x");
  });

  it("keeps the default example from the page unchanged", () => {
    const url = "https://natlee.github.io/invisible-ink/";
    const out = injectZeroWidth(url, "interval");
    expect(out.length).toBe(url.length * 2 - 1);
    expect(out.split(ZWSP).join("")).toBe(url);
  });

  it("rotates U+200B, U+200C, U+200D in Mix mode", () => {
    expect(injectZeroWidth("abcde", "interval", "mix")).toBe(
      `a${ZWSP}b${ZWNJ}c${ZWJ}d${ZWSP}e`
    );
    expect(injectZeroWidth("a b c d", "space-only", "mix")).toBe(
      `a ${ZWSP}b ${ZWNJ}c ${ZWJ}d`
    );
  });

  it("only inserts after whitespace in Space Only mode", () => {
    expect(injectZeroWidth("a b\tc\nd", "space-only")).toBe(
      `a ${ZWSP}b\t${ZWSP}c\n${ZWSP}d`
    );
    expect(injectZeroWidth("nospace", "space-only")).toBe("nospace");
  });

  it("only inserts after : . / in URL Breaker mode", () => {
    expect(injectZeroWidth("https://a.b/c", "url-breaker")).toBe(
      `https:${ZWSP}/${ZWSP}/${ZWSP}a.${ZWSP}b/${ZWSP}c`
    );
  });

  it("never inserts anything at density 0", () => {
    expect(injectZeroWidth("hello world", "random", ZWSP, 0)).toBe("hello world");
  });

  it("only ever adds invisible characters (removing them gives the input back)", () => {
    const samples = ["hello world", "https://example.com/a?b=c", "中文 測試。", "a\nb\tc"];
    for (const text of samples)
      for (const mode of MODES)
        for (const charType of CHAR_TYPES)
          for (let i = 0; i < 20; i++)
            expect(stripInvisible(injectZeroWidth(text, mode, charType, 50))).toBe(text);
  });
});

describe("renderInvisibleForInspector", () => {
  it("returns the text as is when the inspector is off", () => {
    expect(renderInvisibleForInspector(`a${ZWSP}b`, false)).toBe(`a${ZWSP}b`);
  });

  it("shows each invisible character as its code", () => {
    expect(renderInvisibleForInspector(`a${ZWSP}b${ZWNJ}c${ZWJ}d`, true, "tag")).toBe(
      "a<200B>b<200C>c<200D>d"
    );
  });
});

/** Small seeded random source (mulberry32) so random modes are repeatable in tests. */
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Each of these is one character on screen but more than one UTF-16 unit.
const WHOLE = {
  emoji: "\u{1F600}",
  skinTone: "\u{1F44D}\u{1F3FD}",
  flag: "\u{1F1F9}\u{1F1FC}",
  zwjFamily: "\u{1F468}\u200D\u{1F469}\u200D\u{1F467}",
  combiningAccent: "e\u0301",
  thaiWithMarks: "\u0E17\u0E35\u0E48",
};

describe("injectZeroWidth keeps emoji and accented letters whole", () => {
  it("never cuts a character in half in Full Interval mode", () => {
    for (const g of Object.values(WHOLE))
      expect(injectZeroWidth(`a${g}b`, "interval")).toBe(`a${ZWSP}${g}${ZWSP}b`);
  });

  it("gives text that can still be URI-encoded (this used to crash the page)", () => {
    const text = `hi ${Object.values(WHOLE).join(" ")}`;
    for (const mode of MODES)
      for (const charType of CHAR_TYPES)
        expect(() => encodeURIComponent(injectZeroWidth(text, mode, charType, 100))).not.toThrow();
  });
});

describe("injectZeroWidth Random mode", () => {
  it("is the same as Full Interval at 100% density", () => {
    for (const text of ["abc", "hello world", `x${WHOLE.flag}y`])
      expect(injectZeroWidth(text, "random", ZWSP, 100)).toBe(injectZeroWidth(text, "interval", ZWSP));
  });

  it("never adds a character after the last one", () => {
    for (let i = 0; i < 50; i++) expect(injectZeroWidth("abc", "random", "mix", 100)).not.toMatch(/[\u200B-\u200D]$/);
  });

  it("fills about density% of the gaps", () => {
    const out = injectZeroWidth("a".repeat(2001), "random", ZWSP, 30, seeded(1));
    const inserted = out.length - 2001;
    expect(inserted).toBeGreaterThan(500);
    expect(inserted).toBeLessThan(700);
  });

  it("is repeatable with the same random source", () => {
    const a = injectZeroWidth("hello world", "random", "mix", 50, seeded(42));
    const b = injectZeroWidth("hello world", "random", "mix", 50, seeded(42));
    expect(a).toBe(b);
  });
});
