"use client";

import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<null | {
    prompt: string;
    th: string;
    baseType: string;
    style: string;
    layoutLink: string;
  }>(null);
  const [loading, setLoading] = useState(false);

  async function generateBase() {
    setLoading(true);
    setResult(null);

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  return (
    <main>
      <div className="card">
        <h1>TH18 Base AI</h1>
        <p>Skriv en prompt som “anti 2”, “anti 3”, “CWL / ESL BASE” eller “ANTI ALL”.</p>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Skriv din prompt här..."
        />

        <button onClick={generateBase} disabled={loading || !prompt.trim()}>
          {loading ? "Genererar..." : "Generera TH18-layout"}
        </button>

        {result && (
          <div style={{ marginTop: 24 }}>
            <h2>{result.baseType}</h2>
            <p>{result.style}</p>
            <a
              href={result.layoutLink}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#86efac", fontWeight: 700 }}
            >
              Öppna layout-länken
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
