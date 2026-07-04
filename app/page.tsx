"use client";

import { useMemo, useState } from "react";

type Result = {
  prompt: string;
  th: string;
  intent: string;
  layoutMode: string;
  placement: {
    core: string[];
    innerRing: string[];
    outerRing: string[];
    traps: string[];
    notes: string[];
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

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full border px-5 py-3 text-sm font-medium transition-all duration-200",
        "active:scale-[0.98]",
        active
          ? "border-white bg-white text-black shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
          : "border-zinc-800 bg-zinc-900 text-zinc-100 hover:border-zinc-700 hover:bg-zinc-800",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Section({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
      <p className="mb-2 text-xs uppercase tracking-[0.18em] text-zinc-500">{title}</p>
      <ul className="space-y-1 text-sm text-zinc-200">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}

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

    return [items.join(" / "), comments.trim()].filter(Boolean).join(" | ");
  }, [options, comments]);

  function toggle(key: keyof Options) {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  }

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

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-14">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="mb-5 inline-flex rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-2 text-xs text-zinc-400">
            TH18 Base Generator
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">
            Build a clean TH18 base
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-400 md:text-lg">
            Välj bas-typ, skriv extra kommentarer och generera en stilren TH18-plan med en enda delbar länk.
          </p>
        </div>

        <div className="rounded-[28px] border border-zinc-800 bg-zinc-950/90 p-6 shadow-2xl shadow-black/40 backdrop-blur md:p-8">
          <div className="flex flex-wrap gap-3">
            <Pill active={options.anti2} onClick={() => toggle("anti2")}>anti 2</Pill>
            <Pill active={options.anti3} onClick={() => toggle("anti3")}>anti 3</Pill>
            <Pill active={options.cwl} onClick={() => toggle("cwl")}>cwl</Pill>
            <Pill active={options.esl} onClick={() => toggle("esl")}>esl</Pill>
            <Pill active={options.antiAll} onClick={() => toggle("antiAll")}>anti all</Pill>
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm text-zinc-300">Additional comments</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Skriv extra önskemål här..."
              className="min-h-44 w-full rounded-[24px] border border-zinc-800 bg-zinc-900 px-4 py-4 text-white outline-none placeholder:text-zinc-500 focus:border-zinc-600"
            />
          </div>

          <button
            onClick={generateBase}
            disabled={loading || (!options.anti2 && !options.anti3 && !options.cwl && !options.esl && !options.antiAll && !comments.trim())}
            className="mt-5 w-full rounded-full bg-white px-5 py-4 text-sm font-semibold text-black transition hover:bg-zinc-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
          >
            {loading ? "Generating..." : "Generate TH18 layout"}
          </button>

          <p className="mt-4 text-sm text-zinc-500">
            {promptPreview ? `Current prompt: ${promptPreview}` : "Select options above to build your prompt."}
          </p>

          {result && (
            <div className="mt-7 space-y-5 rounded-[28px] border border-zinc-800 bg-zinc-900/70 p-5 md:p-6">
              <div>
                <p className="text-sm text-zinc-400">{result.intent.toUpperCase()}</p>
                <h2 className="mt-1 text-2xl font-semibold text-white">{result.layoutMode}</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Section title="Core" items={result.placement.core} />
                <Section title="Inner ring" items={result.placement.innerRing} />
                <Section title="Outer ring" items={result.placement.outerRing} />
                <Section title="Traps" items={result.placement.traps} />
              </div>

              <Section title="Notes" items={result.placement.notes} />

              <a
                href={result.layoutLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-black"
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
