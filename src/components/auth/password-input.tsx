"use client";

import { useState, type ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { FieldInput } from "./form-field";

export function PasswordInput({
    className,
    ...props
}: Omit<ComponentProps<"input">, "type">) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="relative">
            <FieldInput
                type={visible ? "text" : "password"}
                autoComplete="new-password"
                className={cn("pr-16", className)}
                {...props}
            />
            <button
                type="button"
                aria-label="Show password"
                aria-pressed={visible}
                onClick={() => setVisible((value) => !value)}
                className="absolute top-1/2 right-4 -translate-y-1/2 rounded-sm text-[13px] font-semibold text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
            >
                <span aria-hidden>{visible ? "Hide" : "Show"}</span>
            </button>
        </div>
    );
}