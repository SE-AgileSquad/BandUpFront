"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type Ref } from "react";
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
const localCaptchaToken = "fake-captcha-token";

function isLoopback(hostname: string) {
    return ["localhost", "127.0.0.1", "[::1]"].includes(hostname);
}

function allowLocalCaptcha() {
    if (!env.useLocalCaptcha || !isLoopback(window.location.hostname)) return false;
    try {
        const apiUrl = new URL(env.apiUrl);
        return ["http:", "https:"].includes(apiUrl.protocol) && isLoopback(apiUrl.hostname);
    } catch {
        return false;
    }
}

const subscribeToHost = () => () => undefined;
const serverHostSnapshot = () => false;

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
    const useLocalCaptcha = useSyncExternalStore(subscribeToHost, allowLocalCaptcha, serverHostSnapshot);
    const messageId = useId();
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const hasTokenRef = useRef(false);
    const onChangeRef = useRef(onChange);
    const [widgetError, setWidgetError] = useState<string | null>(null);
    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        if (useLocalCaptcha) onChangeRef.current(localCaptchaToken);
    }, [useLocalCaptcha]);

    useEffect(() => {
        if (useLocalCaptcha || !env.turnstileSiteKey) return;
        let cancelled = false;

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
    }, [useLocalCaptcha]);

    useEffect(() => {
        const widgetId = widgetIdRef.current;
        if (value === null && hasTokenRef.current && widgetId && window.turnstile) {
            hasTokenRef.current = false;
            window.turnstile.reset(widgetId);
        }
    }, [value]);

    const message = error ?? (useLocalCaptcha ? null : widgetError ?? (!env.turnstileSiteKey ? "CAPTCHA is not configured." : null));

    return (
        <div
            ref={ref}
            tabIndex={-1}
            role="group"
            aria-label="CAPTCHA verification"
            aria-describedby={message ? messageId : undefined}
            className={cn(
                "flex min-h-[78px] flex-col gap-2 rounded-field border border-field-border bg-card p-3",
                message && "border-destructive",
            )}
        >
            {useLocalCaptcha ? (
                <label className="flex items-center gap-2 text-sm font-medium">
                    <input
                        type="checkbox"
                        className="size-4 accent-primary"
                        checked={value === localCaptchaToken}
                        onChange={(event) => onChange(event.target.checked ? localCaptchaToken : null)}
                    />
                    Verify for local testing
                </label>
            ) : <div ref={containerRef} />}
            {message && (
                <p id={messageId} role="alert" className="text-[12px] leading-[18px] text-destructive">
                    {message}
                </p>
            )}
        </div>
    );
}
