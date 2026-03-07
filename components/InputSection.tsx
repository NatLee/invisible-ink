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
      <label id="input-label" className="block text-sm font-medium text-slate-700 mb-1">
        輸入區 (Source)
      </label>
      <textarea
        aria-describedby="input-count"
        placeholder="請輸入原始文字或網址…"
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          if (v.length <= MAX_LENGTH) onChange(v);
        }}
        disabled={disabled}
        className="w-full min-h-[160px] md:min-h-[200px] resize-y px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300 disabled:opacity-60 transition-shadow"
        rows={5}
      />
      <p id="input-count" className="mt-1 text-sm text-slate-500">
        字元數: {length}
        {atLimit && " (已達上限)"}
      </p>
    </section>
  );
}
