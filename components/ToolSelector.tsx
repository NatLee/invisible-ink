"use client";

export type ToolId = "zero-width" | "shuffle" | "homoglyph";

const TOOLS: { id: ToolId; label: string }[] = [
  { id: "zero-width", label: "零寬注入" },
  { id: "shuffle", label: "片段打亂" },
  { id: "homoglyph", label: "同形字替換" },
];

export default function ToolSelector({
  value,
  onChange,
}: {
  value: ToolId;
  onChange: (id: ToolId) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="選擇工具"
      className="flex flex-wrap gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200/80"
    >
      {TOOLS.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={value === t.id}
          aria-controls={value === t.id ? `panel-${t.id}` : undefined}
          id={`tab-${t.id}`}
          type="button"
          onClick={() => onChange(t.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 ${
            value === t.id
              ? "bg-white text-violet-700 shadow-sm border border-slate-200"
              : "text-slate-600 hover:text-slate-800 hover:bg-white/60"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export { TOOLS };
