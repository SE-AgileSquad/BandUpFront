"use client";

import { useEffect, useState } from "react";

const fontOptions = [
  { name: "Vazirmatn", family: "Vazirmatn, sans-serif", note: "Persian / sans serif" },
  { name: "Inter", family: "Inter, sans-serif", note: "Modern sans serif" },
  { name: "Literata", family: "Literata, serif", note: "Serif / variable weight" },
  { name: "Caesar Dressing", family: "CaesarDressing, cursive", note: "Display" },
  { name: "System UI", family: "ui-sans-serif, system-ui, sans-serif", note: "Browser default" },
];

const scaleSamples = [
  ["Caption", "text-caption", "11px"],
  ["Small", "text-small", "13px"],
  ["Body", "text-body", "14px"],
  ["Lead", "text-lead", "18px"],
  ["Heading 4", "text-h4", "20px"],
  ["Heading 1", "text-h1", "28px"],
  ["Display", "text-display", "34px"],
  ["Heading 2", "text-h2", "36px"],
  ["Hero", "text-hero", "56px"],
];

export default function FontTestPage() {
  const [dark, setDark] = useState(false);
  const [font, setFont] = useState(fontOptions[0]);
  const [sample, setSample] = useState(
    "The quick brown fox jumps over the lazy dog."
  );
  const [fontSize, setFontSize] = useState(32);
  const [fontWeight, setFontWeight] = useState(400);
  const [italic, setItalic] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("bandup-theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    setDark(savedTheme ? savedTheme === "dark" : prefersDark);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", dark);
    root.dataset.theme = dark ? "dark" : "light";
    window.localStorage.setItem("bandup-theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <main className="min-h-screen bg-background px-5 py-12 text-foreground transition-colors sm:px-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-small text-muted-foreground">
              BandUp · UI tools
            </p>
            <h1 className="mt-1 text-h2-sm font-bold sm:text-h2">
              Font & text tester
            </h1>
            <nav className="mt-3 flex gap-4 text-small text-primary">
              <a
                className="underline underline-offset-4"
                href="/test/fonts"
                aria-current="page"
              >
                Fonts
              </a>
              <a
                className="underline underline-offset-4"
                href="/test/colors"
              >
                Colors
              </a>
            </nav>
          </div>

          <button
            type="button"
            aria-pressed={dark}
            onClick={() => setDark((current) => !current)}
            className="rounded-lg border border-border bg-card px-4 py-2 text-body font-medium text-card-foreground transition-colors hover:bg-secondary"
          >
            {dark ? "☀️ Switch to light" : "🌙 Switch to dark"}
          </button>
        </header>

        <section className="rounded-xl border border-border bg-card p-6 shadow-card sm:p-8">
          <h2 className="text-lead font-semibold">Preview controls</h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-small font-medium">
              Font family
              <select
                value={font.name}
                onChange={(event) =>
                  setFont(
                    fontOptions.find(
                      (option) => option.name === event.target.value
                    ) ?? fontOptions[0]
                  )
                }
                className="rounded-lg border border-input bg-background px-3 py-2 text-body text-foreground"
              >
                {fontOptions.map((option) => (
                  <option key={option.name} value={option.name}>
                    {option.name} — {option.note}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-small font-medium">
              Font weight: {fontWeight}
              <select
                value={fontWeight}
                onChange={(event) =>
                  setFontWeight(Number(event.target.value))
                }
                className="rounded-lg border border-input bg-background px-3 py-2 text-body text-foreground"
              >
                {[200, 300, 400, 500, 600, 700, 800, 900, 950].map(
                  (weight) => (
                    <option key={weight} value={weight}>
                      {weight}
                    </option>
                  )
                )}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-small font-medium">
              Font size: {fontSize}px
              <input
                type="range"
                min="12"
                max="72"
                value={fontSize}
                onChange={(event) =>
                  setFontSize(Number(event.target.value))
                }
              />
            </label>

            <label className="flex items-center gap-2 self-end pb-2 text-small font-medium">
              <input
                type="checkbox"
                checked={italic}
                onChange={(event) => setItalic(event.target.checked)}
              />
              Italic
            </label>
          </div>

          <label className="mt-5 flex flex-col gap-2 text-small font-medium">
            Sample text
            <textarea
              value={sample}
              onChange={(event) => setSample(event.target.value)}
              rows={3}
              className="resize-y rounded-lg border border-input bg-background px-3 py-2 text-body text-foreground"
            />
          </label>

          <div
            className="mt-5 min-h-28 rounded-lg border border-border bg-background p-5 text-foreground"
            style={{ fontFamily: font.family }}
          >
            <p
              style={{
                fontSize: `${fontSize}px`,
                fontWeight,
                fontStyle: italic ? "italic" : "normal",
                overflowWrap: "anywhere",
              }}
            >
              {sample || "Your preview will appear here."}
            </p>
          </div>

          <p className="mt-2 text-small text-muted-foreground">
            Currently previewing {font.name}
          </p>
        </section>

        <section
          aria-label="Typography scale preview"
          className="space-y-3"
        >
          <h2 className="text-lead font-semibold">Typography scale</h2>

          <div className="overflow-hidden rounded-xl border border-border bg-card">
            {scaleSamples.map(([name, className, size]) => (
              <div
                key={name}
                className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border p-4 last:border-b-0"
              >
                <p
                  className={className}
                  style={{
                    fontFamily: font.family,
                    fontWeight,
                    fontStyle: italic ? "italic" : "normal",
                    overflowWrap: "anywhere",
                  }}
                >
                  {sample || "Aa Bb 123"}
                </p>
                <span className="shrink-0 text-small text-muted-foreground">
                  {name} · {size}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}