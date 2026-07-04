"use client";

import { useMemo, useState } from "react";

type Result = {
  prompt: string;
  th: string;
  baseType: string;
  style: string;
  placement: {
    core: string;
    innerRing: string;
    outerRing: string;
    traps: string;
    note: string;
  };
  layoutLink: string;
};

type Options = {
  anti2: boolean;
  anti3: boolean;
  cwl: boolean;
  esl: boolean;
  antiAll: boolean;
};

export default function Home() {
  const [options, setOptions] = useState<Options>({
    anti2: false,
    anti3: false,
    cwl: false,
    esl: false,
    antiAll: false,
  });
  const [comments, setComments] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  const promptPreview = useMemo(() => {
    const items = [
      options.anti2 ? "anti 2" : null,
      options.anti3 ? "anti 3" : null,
      options.cwl ? "cwl" : null,
      options.esl ? "esl" : null,
      options.antiAll ? "anti all" : null,
    ].filter(Boolean);
    return [items.join(" / "), comments].filter(Boolean).join(" | ");
  }, [options, comments]);

  async function generateBase() {
    setLoading(true);
    setResult(null);

    const selected = [
      options.anti2 ? "anti 2" : null,
      options.anti3 ? "anti 3" : null,
      options.cwl ? "cwl" : null,
      options.esl ? "esl" : null,
      options.antiAll ? "anti all" : null,
    ]
      .filter(Boolean)
      .join(" / ");

    const prompt = `${selected}${comments.trim() ? ` | ${comments.trim()}` : ""}`.trim();

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  function toggle(key: keyof Options) {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <main className="min-h-screen bg-[#111111] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-6 py-12">
        <div className="mb-8 text-center">
          <p className="mb-3 text-sm text-zinc-400">TH18 Base AI</p>
          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">
            Build a better TH18 base
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-400 md:text-lg">
            Välj vad du vill ha, skriv extra önskemål, och få en TH18-base med en delbar länk.
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-2xl shadow-black/30 backdrop-blur">
          <div className="grid gap-3 md:grid-cols-3">
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-4">
              <input type="checkbox" checked={options.anti2} onChange={() => toggle("anti2")} className="h-4 w-4 accent-white" />
              <span className="text-sm font-medium">anti 2</span>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-4">
              <input type="checkbox" checked={options.anti3} onChange={() => toggle("anti3")} className="h-4 w-4 accent-white" />
              <span className="text-sm font-medium">anti 3</span>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-4">
              <input type="checkbox" checked={options.cwl} onChange={() => toggle("cwl")} className="h-4 w-4 accent-white" />
              <span className="text-sm font-medium">cwl / esl</span>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-4">
              <input type="checkbox" checked={options.esl} onChange={() => toggle("esl")} className="h-4 w-4 accent-white" />
              <span className="text-sm font-medium">esl</span>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-4 md:col-span-2">
              <input type="checkbox" checked={options.antiAll} onChange={() => toggle("antiAll")} className="h-4 w-4 accent-white" />
              <span className="text-sm font-medium">anti all</span>
            </label>
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm text-zinc-300">Additional comments</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Skriv extra önskemål här, till exempel anti backpack, anti throwers, anti duke charge..."
              className="min-h-40 w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-4 text-white outline-none placeholder:text-zinc-500 focus:border-zinc-600"
            />
          </div>

          <button
            onClick={generateBase}
            disabled={loading || (!options.anti2 && !options.anti3 && !options.cwl && !options.esl && !options.antiAll && !comments.trim())}
            className="mt-5 w-full rounded-2xl bg-white px-4 py-4 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
          >
            {loading ? "Generating..." : "Generate TH18 layout"}
          </button>

          <p className="mt-4 text-sm text-zinc-500">
            {promptPreview ? `Current prompt: ${promptPreview}` : "Select options above to build your prompt."}
          </p>

          {result && (
            <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
              <p className="text-sm text-zinc-400">{result.baseType}</p>
              <h2 className="mt-1 text-2xl font-semibold text-white">{result.style}</h2>
              <div className="mt-4 space-y-2 text-sm text-zinc-300">
                <p><span className="text-zinc-400">Core:</span> {result.placement.core}</p>
                <p><span className="text-zinc-400">Inner ring:</span> {result.placement.innerRing}</p>
                <p><span className="text-zinc-400">Outer ring:</span> {result.placement.outerRing}</p>
                <p><span className="text-zinc-400">Traps:</span> {result.placement.traps}</p>
                <p><span className="text-zinc-400">Note:</span> {result.placement.note}</p>
              </div>

              <a
                href={result.layoutLink}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black"
              >
                Open layout link
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
