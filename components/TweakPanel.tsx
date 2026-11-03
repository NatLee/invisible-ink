"use client";

import { INVISIBLE_CHARS, codePointHex, type InjectionMode, type CharType } from "@/lib/injector";
import { stripInput } from "./styles";

/** Random mode density is a percentage. */
const DENSITY_RANGE = { min: 0, max: 100 };

const MODE_OPTIONS: { value: InjectionMode; label: string }[] = [
  { value: "interval", label: "Full Interval" },
  { value: "random", label: "Random" },
  { value: "space-only", label: "Space Only" },
  { value: "url-breaker", label: "URL Breaker" },
];

/** One option per invisible character (value "200B" etc.), plus Mix. */
const CHAR_OPTIONS: { value: string; label: string; charType: CharType }[] = [
  ...INVISIBLE_CHARS.map(({ char, name }) => ({
    value: codePointHex(char),
    label: `${name} (U+${codePointHex(char)})`,
    charType: char,
  })),
  { value: "mix", label: "Mix", charType: "mix" },
];

const optionFor = (charType: CharType) => CHAR_OPTIONS.find((o) => o.charType === charType)!;
const charTypeFor = (value: string) => CHAR_OPTIONS.find((o) => o.value === value)!.charType;

export default function TweakPanel({
  mode,
  charType,
  density,
  onModeChange,
  onCharTypeChange,
  onDensityChange,
}: {
  mode: InjectionMode;
  charType: CharType;
  density: number;
  onModeChange: (m: InjectionMode) => void;
  onCharTypeChange: (c: CharType) => void;
  onDensityChange: (d: number) => void;
}) {
  const showDensity = mode === "random";

  return (
    <section
      aria-labelledby="tweak-label"
      className="flex flex-wrap items-end gap-4"
    >
      <h2 id="tweak-label" className="sr-only">
        設定區 (Tweaks)
      </h2>

      <div className="flex flex-col gap-1">
        <label htmlFor="injection-mode" className="text-xs font-medium text-slate-300">
          模式
        </label>
        <select
          id="injection-mode"
          value={mode}
          onChange={(e) => onModeChange(e.target.value as InjectionMode)}
          className={`min-w-[140px] ${stripInput}`}
          aria-describedby={showDensity ? "density-desc" : undefined}
        >
          {MODE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="char-type" className="text-xs font-medium text-slate-300">
          字元類型
        </label>
        <select
          id="char-type"
          value={optionFor(charType).value}
          onChange={(e) => onCharTypeChange(charTypeFor(e.target.value))}
          className={`min-w-[180px] ${stripInput}`}
        >
          {CHAR_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {showDensity && (
        <div id="density-desc" className="flex flex-col gap-1 flex-1 min-w-[160px] max-w-[240px]">
          <label htmlFor="density" className="text-xs font-medium text-slate-300">
            密度: {density}%
          </label>
          <input
            id="density"
            type="range"
            min={DENSITY_RANGE.min}
            max={DENSITY_RANGE.max}
            value={density}
            onChange={(e) => onDensityChange(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none bg-slate-600 accent-violet-400"
          />
        </div>
      )}
    </section>
  );
}
