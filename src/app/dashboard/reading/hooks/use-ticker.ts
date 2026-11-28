"use client";

import { useEffect, useState } from "react";

export function useTicker(active: boolean, intervalMs = 1000) {
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        if (!active) return;
        const id = window.setInterval(() => setNow(Date.now()), intervalMs);
        return () => window.clearInterval(id);
    }, [active, intervalMs]);

    return now;
}
