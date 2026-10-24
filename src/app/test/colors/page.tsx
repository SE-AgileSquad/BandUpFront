"use client";

import { useEffect, useState } from "react";

const colorGroups = [
    {
        title: "Surface",
        colors: [
            ["Background", "bg-background", "text-foreground"],
            ["Card", "bg-card", "text-card-foreground"],
            ["Secondary", "bg-secondary", "text-secondary-foreground"],
            ["Muted", "bg-muted", "text-muted-foreground"],
            ["Accent", "bg-accent", "text-accent-foreground"],
        ],
    },
    {
        title: "Actions",
        colors: [["Primary", "bg-primary", "text-primary-foreground"]],
    },
    {
        title: "Status",
        colors: [
            ["Success", "bg-success", "text-white"],
            ["Warning", "bg-warning", "text-white"],
            ["Destructive", "bg-destructive", "text-destructive-foreground"],
            ["Highlight", "bg-highlight", "text-highlight-foreground"],
        ],
    },
];

export default function MainPage() {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        const savedTheme = window.localStorage.getItem("bandup-theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
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
                        <p className="text-small text-muted-foreground">BandUp · UI tools</p>
                        <h1 className="mt-1 text-h2-sm font-bold sm:text-h2">Theme & color tester</h1>
                        <nav className="mt-3 flex gap-4 text-small text-primary">
                            <a className="underline underline-offset-4" href="/test/fonts" aria-current="page">Fonts</a>
                            <a className="underline underline-offset-4" href="/test/colors">Colors</a>
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

                <section aria-label="CSS color token preview" className="space-y-6">
                    {colorGroups.map((group) => (
                        <div key={group.title}>
                            <h2 className="mb-3 text-lead font-semibold">{group.title}</h2>
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {group.colors.map(([name, background, foreground]) => (
                                    <div
                                        key={name}
                                        className={`rounded-lg border border-border ${background} ${foreground} p-4`}
                                    >
                                        <p className="font-semibold">{name}</p>
                                        <p className="mt-1 text-small opacity-80">{background.replace("bg-", "--")}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </section>
            </div>
        </main>
    );
}
