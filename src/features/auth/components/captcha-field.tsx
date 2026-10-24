"use client";

import { useId, useImperativeHandle, type Ref } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { MOCK_CAPTCHA_TOKEN } from "../constants/auth.constants";

export interface CaptchaFieldHandle {
    reset: () => void;
}

export interface CaptchaFieldProps {
    value: string;
    onChange: (token: string) => void;
    onExpire?: () => void;
    onError?: () => void;
    hasError?: boolean;
    disabled?: boolean;
    ref?: Ref<CaptchaFieldHandle>;
}

export function CaptchaField({
    value,
    onChange,
    hasError = false,
    disabled = false,
    ref,
}: CaptchaFieldProps) {
    const checkboxId = useId();

    useImperativeHandle(ref, () => ({ reset: () => onChange("") }), [onChange]);

    return (
        <div
            className={cn(
                "flex items-center justify-between rounded-lg border bg-muted p-4",
                hasError ? "border-destructive" : "border-border",
            )}
        >
            <div className="flex items-center gap-3">
                <Checkbox
                    id={checkboxId}
                    checked={value !== ""}
                    disabled={disabled}
                    aria-invalid={hasError}
                    className="bg-background dark:bg-background"
                    onCheckedChange={(checked) =>
                        onChange(checked === true ? MOCK_CAPTCHA_TOKEN : "")
                    }
                />
                <Label htmlFor={checkboxId} className="text-body font-medium text-foreground">
                    I&apos;m not a robot
                </Label>
            </div>
            <span className="text-caption text-muted-foreground">CAPTCHA</span>
        </div>
    );
}