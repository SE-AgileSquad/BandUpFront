"use client";

import { useEffect, useRef } from "react";
import { AUTH_REDIRECT_DELAY_MS } from "@/constants/auth";

export function useAutoContinue(
    enabled: boolean,
    onContinue: () => void | Promise<void>,
    delay = AUTH_REDIRECT_DELAY_MS,
) {
    const callback = useRef(onContinue);

    useEffect(() => {
        callback.current = onContinue;
    });

    useEffect(() => {
        if (!enabled) return;
        const id = window.setTimeout(() => {
            void callback.current();
        }, delay);
        return () => window.clearTimeout(id);
    }, [enabled, delay]);
}