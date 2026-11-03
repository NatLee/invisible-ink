"use client";

const MAX_LENGTH = 10_000;

export default function InputSection({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const length = value.length;
  const atLimit = length >= MAX_LENGTH;

  return (
    <section aria-labelledby="input-label">
      <div className="flex items-center justify-between gap-2 mb-2">
        <label id="input-label" htmlFor="source-input" className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          Source
        </label>
        <span
          id="input-count"
          className="rounded-full bg-slate-200/80 px-3 py-1 text-xs font-mono text-slate-600"
          aria-live="polite"
        >
          {length}
          {atLimit && " (max)"}
        </span>
      </div>
      <textarea
        id="source-input"
        aria-describedby="input-count"
        placeholder="請輸入原始文字或網址…"
        value={value}
        maxLength={MAX_LENGTH}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full min-h-[160px] lg:min-h-[220px] resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-300 disabled:opacity-60 transition-all duration-200"
        rows={5}
      />
    </section>
  );
}
