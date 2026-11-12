"use client";

import { useId, type Ref } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type CaptchaFieldProps = {
    value: string | null;
    onChange: (token: string | null) => void;
    error?: string;
    ref?: Ref<HTMLButtonElement>;
};

const DEV_TOKEN = "dev-captcha-token";

export function CaptchaField({ value, onChange, error, ref }: CaptchaFieldProps) {
    const id = useId();
    const labelId = `${id}-label`;
    const errorId = `${id}-error`;
    const checked = Boolean(value);

    return (
        <div className="flex flex-col gap-2">
            <div
                className={cn(
                    "flex h-14 items-center gap-3 rounded-field border border-field-border bg-card px-4",
                    error && "border-destructive",
                )}
            >
                <button
                    ref={ref}
                    type="button"
                    role="checkbox"
                    aria-checked={checked}
                    aria-labelledby={labelId}
                    aria-invalid={Boolean(error) || undefined}
                    aria-describedby={error ? errorId : undefined}
                    onClick={() => onChange(checked ? null : DEV_TOKEN)}
                    className="grid size-[22px] shrink-0 place-items-center rounded-[6px] border-2 border-primary outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
                >
                    {checked && <Check aria-hidden className="size-4 text-primary" />}
                </button>
                <span id={labelId} className="text-[15px] leading-[22px] font-medium">
                    I&apos;m not a robot
                </span>
                <span className="ml-auto text-[11px] text-muted-foreground">CAPTCHA</span>
            </div>
            {error && (
                <p
                    id={errorId}
                    role="alert"
                    className="text-[12px] leading-[18px] text-destructive"
                >
                    {error}
                </p>
            )}
        </div>
    );
}