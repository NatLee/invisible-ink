"use client";

import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyButton({
  text,
  disabled,
  "aria-label": ariaLabel = "複製結果",
}: {
  text: string;
  disabled?: boolean;
  "aria-label"?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!text || disabled) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      const t = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(t);
    } catch {
      setCopied(false);
    }
  }, [text, disabled]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={disabled || !text}
      aria-label={ariaLabel}
      aria-live="polite"
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" aria-hidden />
          <span>已複製</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" aria-hidden />
          <span>複製結果</span>
        </>
      )}
    </button>
  );
}
