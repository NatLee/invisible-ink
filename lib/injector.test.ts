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
