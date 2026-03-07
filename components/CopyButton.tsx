"use client";

import { useState, useCallback, useRef, useEffect } from "react";
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
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCopy = useCallback(async () => {
    if (!text || disabled) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
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
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-600 text-white hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none disabled:hover:translate-y-0 disabled:hover:shadow-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition-all duration-200"
    >
      {copied ? (
        <span className="inline-flex items-center gap-2 animate-checkmark">
          <Check className="w-4 h-4" aria-hidden />
          <span>已複製</span>
        </span>
      ) : (
        <>
          <Copy className="w-4 h-4" aria-hidden />
          <span>複製結果</span>
        </>
      )}
    </button>
  );
}
