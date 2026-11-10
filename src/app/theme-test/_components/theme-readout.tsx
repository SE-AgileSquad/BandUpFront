"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

type Readout = {
  fontFamily: string;
  htmlClass: string;
  background: string;
  primary: string;
};

export function ThemeReadout() {
  const { theme, resolvedTheme } = useTheme();
  const [readout, setReadout] = useState<Readout | null>(null);

  useEffect(() => {
    const body = getComputedStyle(document.body);
    const root = getComputedStyle(document.documentElement);
    setReadout({
      fontFamily: body.fontFamily,
      htmlClass: document.documentElement.className || "(none)",
      background: root.getPropertyValue("--background").trim(),
      primary: root.getPropertyValue("--primary").trim(),
    });
  }, [theme, resolvedTheme]);

  const rows: [string, string][] = [
    ["theme (selected)", theme ?? "-"],
    ["theme (resolved)", resolvedTheme ?? "-"],
    ["<html> class", readout?.htmlClass ?? "-"],
    ["--background", readout?.background ?? "-"],
    ["--primary", readout?.primary ?? "-"],
    ["body font-family", readout?.fontFamily ?? "-"],
  ];

  return (
    <dl className="grid gap-2 text-body-sm sm:grid-cols-[200px_1fr]">
      {rows.map(([label, value]) => (
        <div key={label} className="contents">
          <dt className="text-muted-foreground">{label}</dt>
          <dd className="font-mono break-all">{value}</dd>
        </div>
      ))}
    </dl>
  );
}