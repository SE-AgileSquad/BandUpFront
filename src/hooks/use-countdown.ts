"use client";

import { useEffect, useState } from "react";

const pad = (value: number) => String(value).padStart(2, "0");

export function useCountdown(targetTimestamp: number | null | undefined) {
    const target = targetTimestamp ?? null;
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        queueMicrotask(() => setNow(Date.now()));
        if (target === null || target <= Date.now()) return;

        const id = window.setInterval(() => {
            const current = Date.now();
            setNow(current);
            if (current >= target) window.clearInterval(id);
        }, 250);

        return () => window.clearInterval(id);
    }, [target]);

    const secondsLeft =
        target === null ? 0 : Math.max(0, Math.ceil((target - now) / 1000));

    return {
        secondsLeft,
        formatted: `${pad(Math.floor(secondsLeft / 60))}:${pad(secondsLeft % 60)}`,
        isDone: secondsLeft === 0,
    };
}
