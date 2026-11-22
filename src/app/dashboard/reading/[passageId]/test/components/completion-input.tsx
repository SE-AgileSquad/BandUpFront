"use client";

import { useId } from "react";
import { TEST_COPY } from "../constants/test";

type CompletionInputProps = {
    value: string;
    disabled: boolean;
    onChange: (value: string) => void;
};

export function CompletionInput({ value, disabled, onChange }: CompletionInputProps) {
    const id = useId();

    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id} className="text-[14px] leading-[21px] font-medium">
                {TEST_COPY.completion.label}
            </label>
            <input
                id={id}
                type="text"
                value={value}
                maxLength={60}
                disabled={disabled}
                autoComplete="off"
                onChange={(event) => onChange(event.target.value)}
                onBlur={() => {
                    if (value !== value.trim()) onChange(value.trim());
                }}
                className="h-[52px] w-full rounded-field border border-field-border bg-field px-4 text-[15px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-60"
            />
        </div>
    );
}