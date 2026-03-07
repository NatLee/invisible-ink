"use client";

import { useState, useMemo } from "react";
import { Github } from "lucide-react";
import InputSection from "@/components/InputSection";
import TweakPanel from "@/components/TweakPanel";
import ResultSection from "@/components/ResultSection";
import {
  injectZeroWidth,
  type InjectionMode,
  type CharType,
  type InspectorStyle,
} from "@/lib/injector";

const DEFAULT_MODE: InjectionMode = "interval";
const DEFAULT_CHAR: CharType = "\u200B";
const DEFAULT_DENSITY = 50;

export default function Home() {
  const [source, setSource] = useState("");
  const [mode, setMode] = useState<InjectionMode>(DEFAULT_MODE);
  const [charType, setCharType] = useState<CharType>(DEFAULT_CHAR);
  const [density, setDensity] = useState(DEFAULT_DENSITY);
  const [inspectorEnabled, setInspectorEnabled] = useState(false);
  const [inspectorStyle, setInspectorStyle] = useState<InspectorStyle>("tag");

  const result = useMemo(
    () => injectZeroWidth(source, mode, charType, density),
    [source, mode, charType, density]
  );

  const handleReset = () => {
    setSource("");
    setMode(DEFAULT_MODE);
    setCharType(DEFAULT_CHAR);
    setDensity(DEFAULT_DENSITY);
    setInspectorEnabled(false);
    setInspectorStyle("tag");
  };

  const originalLength = source.length;
  const resultLength = result.length;

  const originalEncoded = source ? encodeURIComponent(source) : "";
  const resultEncoded = result ? encodeURIComponent(result) : "";

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200 bg-white px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-800">
          Zero-Width Injector
        </h1>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-slate-600 hover:text-slate-900"
          aria-label="GitHub 儲存庫"
        >
          <Github className="w-5 h-5" aria-hidden />
        </a>
      </header>

      <main className="flex-1 container max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-[1fr,200px,1fr]">
          <div>
            <InputSection value={source} onChange={setSource} />
          </div>
          <div className="md:pt-8">
            <TweakPanel
              mode={mode}
              charType={charType}
              density={density}
              onModeChange={setMode}
              onCharTypeChange={setCharType}
              onDensityChange={setDensity}
            />
          </div>
          <div>
            <ResultSection
              result={result}
              inspectorEnabled={inspectorEnabled}
              inspectorStyle={inspectorStyle}
              onInspectorToggle={() => setInspectorEnabled((v) => !v)}
              onInspectorStyleChange={setInspectorStyle}
              onReset={handleReset}
            />
          </div>
        </div>

        <section
          aria-labelledby="comparison-heading"
          className="rounded-lg border border-slate-200 bg-white p-4"
        >
          <h2 id="comparison-heading" className="text-sm font-medium text-slate-700 mb-3">
            長度對比
          </h2>
          <div className="flex flex-wrap gap-6 text-sm">
            <p>
              <span className="text-slate-500">原始長度：</span>
              <span className="font-mono font-medium">{originalLength}</span>
            </p>
            <p>
              <span className="text-slate-500">處理後長度：</span>
              <span className="font-mono font-medium">{resultLength}</span>
            </p>
          </div>
        </section>

        <section
          aria-labelledby="encode-heading"
          className="rounded-lg border border-slate-200 bg-white p-4"
        >
          <h2 id="encode-heading" className="text-sm font-medium text-slate-700 mb-3">
            URI Encode 對照
          </h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-slate-500">Original: </span>
              <code className="break-all font-mono bg-slate-100 px-1 rounded">
                {originalEncoded || "(空)"}
              </code>
            </div>
            <div>
              <span className="text-slate-500">Obfuscated: </span>
              <code className="break-all font-mono bg-slate-100 px-1 rounded">
                {resultEncoded || "(空)"}
              </code>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
