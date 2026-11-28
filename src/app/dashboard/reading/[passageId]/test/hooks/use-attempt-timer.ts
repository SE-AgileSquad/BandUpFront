"use client";

import { useEffect, useRef, useState } from "react";
import { remainingMs } from "@/app/dashboard/reading/_shared/lib/clock";

type Options = {
    endsAt: string | null;
    offsetMs: number;
    enabled: boolean;
    onTimeUp: () => void;
};

export function useAttemptTimer({ endsAt, offsetMs, enabled, onTimeUp }: Options) {
    const [seconds, setSeconds] = useState<number | null>(null);
    const onTimeUpRef = useRef(onTimeUp);
    const firedRef = useRef(false);

    useEffect(() => {
        onTimeUpRef.current = onTimeUp;
    });

    useEffect(() => {
        if (!enabled || !endsAt) return;
        firedRef.current = false;

        const tick = () => {
            const ms = remainingMs(endsAt, offsetMs);
            setSeconds(Math.max(0, Math.ceil(ms / 1000)));
            if (ms <= 0 && !firedRef.current) {
                firedRef.current = true;
                onTimeUpRef.current();
            }
        };

        tick();
        const id = window.setInterval(tick, 250);
        document.addEventListener("visibilitychange", tick);
        window.addEventListener("focus", tick);

        return () => {
            window.clearInterval(id);
            document.removeEventListener("visibilitychange", tick);
            window.removeEventListener("focus", tick);
        };
    }, [enabled, endsAt, offsetMs]);

    return seconds;
}