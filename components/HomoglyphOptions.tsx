"use client";

import type { HomoglyphStrength } from "@/lib/homoglyph";

const STRENGTHS: { value: HomoglyphStrength; label: string }[] = [
  { value: "minimal", label: "最小 (a,e,o)" },
  { value: "medium", label: "中等" },
  { value: "full", label: "完整" },
];

const stripInput =
  "px-3 py-2 rounded-lg border border-slate-600 bg-slate-700/80 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-all duration-200";

export default function HomoglyphOptions({
  strength,
  onStrengthChange,
}: {
  strength: HomoglyphStrength;
  onStrengthChange: (s: HomoglyphStrength) => void;
}) {
  return (
    <section
      aria-labelledby="homoglyph-options-label"
      className="flex flex-wrap items-end gap-4"
    >
      <h2 id="homoglyph-options-label" className="sr-only">
        同形字替換設定
      </h2>
      <div className="flex flex-col gap-1">
        <label htmlFor="homoglyph-strength" className="text-xs font-medium text-slate-300">
          替換強度
        </label>
        <select
          id="homoglyph-strength"
          value={strength}
          onChange={(e) => onStrengthChange(e.target.value as HomoglyphStrength)}
          className={`min-w-[180px] ${stripInput}`}
        >
          {STRENGTHS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
