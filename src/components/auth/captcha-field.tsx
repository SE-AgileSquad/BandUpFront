"use client";

import { useEffect, useRef, useState, type Ref } from "react";
import { env } from "@/config/env";
import { cn } from "@/lib/utils";

type TurnstileRenderOptions = {
    sitekey: string;
    callback: (token: string) => void;
    "expired-callback": () => void;
    "error-callback": () => void;
};

type TurnstileApi = {
    render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
    reset: (widgetId: string) => void;
    remove: (widgetId: string) => void;
};

declare global {
    interface Window {
        turnstile?: TurnstileApi;
    }
}

let turnstileScriptPromise: Promise<void> | null = null;

function loadTurnstile() {
    if (window.turnstile) return Promise.resolve();
    if (turnstileScriptPromise) return turnstileScriptPromise;

    turnstileScriptPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        script.onload = () => {
            if (window.turnstile) resolve();
            else reject(new Error("Turnstile did not initialize."));
        };
        script.onerror = () => reject(new Error("Turnstile failed to load."));
        document.head.appendChild(script);
    });

    return turnstileScriptPromise;
}

type CaptchaFieldProps = {
    value: string | null;
    onChange: (token: string | null) => void;
    error?: string;
    ref?: Ref<HTMLDivElement>;
};

export function CaptchaField({ value, onChange, error, ref }: CaptchaFieldProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const hasTokenRef = useRef(false);
    const onChangeRef = useRef(onChange);
    const [widgetError, setWidgetError] = useState<string | null>(null);
    onChangeRef.current = onChange;

    useEffect(() => {
        let cancelled = false;

        if (!env.turnstileSiteKey) {
            setWidgetError("CAPTCHA is not configured.");
            return;
        }

        loadTurnstile()
            .then(() => {
                if (cancelled || !containerRef.current || !window.turnstile) return;

                widgetIdRef.current = window.turnstile.render(containerRef.current, {
                    sitekey: env.turnstileSiteKey,
                    callback: (token) => {
                        hasTokenRef.current = true;
                        setWidgetError(null);
                        onChangeRef.current(token);
                    },
                    "expired-callback": () => {
                        hasTokenRef.current = false;
                        setWidgetError("CAPTCHA expired. Please complete it again.");
                        onChangeRef.current(null);
                    },
                    "error-callback": () => {
                        hasTokenRef.current = false;
                        setWidgetError("CAPTCHA failed to load. Please try again.");
                        onChangeRef.current(null);
                    },
                });
            })
            .catch(() => {
                if (!cancelled) {
                    setWidgetError("CAPTCHA failed to load. Check your connection and try again.");
                }
            });

        return () => {
            cancelled = true;
            if (widgetIdRef.current && window.turnstile) {
                window.turnstile.remove(widgetIdRef.current);
                widgetIdRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        const widgetId = widgetIdRef.current;
        if (value === null && hasTokenRef.current && widgetId && window.turnstile) {
            hasTokenRef.current = false;
            window.turnstile.reset(widgetId);
        }
    }, [value]);

    const message = error ?? widgetError;

    return (
        <div
            ref={ref}
            tabIndex={-1}
            role="group"
            aria-label="CAPTCHA verification"
            aria-invalid={Boolean(message) || undefined}
            className={cn(
                "flex min-h-[78px] flex-col gap-2 rounded-field border border-field-border bg-card p-3",
                message && "border-destructive",
            )}
        >
            <div ref={containerRef} className="flex justify-center" />
            {message && (
                <p role="alert" className="text-[12px] leading-[18px] text-destructive">
                    {message}
                </p>
            )}
        </div>
    );
}
