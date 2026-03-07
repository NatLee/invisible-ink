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
  const [source, setSource] = useState("https://natlee.github.io/zero-width-generator/");
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
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-sm px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-800 tracking-tight">
          Zero-Width Injector
        </h1>
        <a
          href="https://github.com/NatLee/zero-width-generator"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 transition-colors rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          aria-label="GitHub 儲存庫"
        >
          <Github className="w-5 h-5" aria-hidden />
        </a>
      </header>

      <main className="flex-1 container max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col gap-6 md:grid md:grid-cols-[minmax(0,1fr),220px,minmax(0,1fr)] md:items-start">
          <div className="min-h-0 w-full rounded-xl bg-white/80 shadow-sm border border-slate-200/60 p-4">
            <InputSection value={source} onChange={setSource} />
          </div>
          <div className="md:pt-10 shrink-0 rounded-xl bg-white/80 shadow-sm border border-slate-200/60 p-4">
            <TweakPanel
              mode={mode}
              charType={charType}
              density={density}
              onModeChange={setMode}
              onCharTypeChange={setCharType}
              onDensityChange={setDensity}
            />
          </div>
          <div className="min-h-0 w-full rounded-xl bg-white/80 shadow-sm border border-slate-200/60 p-4">
            <ResultSection
              result={result}
              charType={charType}
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
          className="rounded-xl bg-white/80 shadow-sm border border-slate-200/60 p-4"
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
          className="rounded-xl bg-white/80 shadow-sm border border-slate-200/60 p-4"
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
