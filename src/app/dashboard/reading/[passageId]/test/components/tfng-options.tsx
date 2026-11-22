"use client";

import { useRef } from "react";
import { TFNG_OPTIONS } from "@/app/dashboard/reading/_shared/constants/reading";
import { cn } from "@/lib/utils";

type TfngOptionsProps = {
    labelledBy: string;
    value: string;
    disabled: boolean;
    onChange: (value: string) => void;
};

export function TfngOptions({ labelledBy, value, disabled, onChange }: TfngOptionsProps) {
    const refs = useRef<(HTMLButtonElement | null)[]>([]);
    const selectedIndex = TFNG_OPTIONS.findIndex((option) => option.value === value);

    function handleKeyDown(event: React.KeyboardEvent, index: number) {
        const last = TFNG_OPTIONS.length - 1;
        let next = index;

        if (event.key === "ArrowDown" || event.key === "ArrowRight") {
            next = index === last ? 0 : index + 1;
        } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
            next = index === 0 ? last : index - 1;
        } else {
            return;
        }

        event.preventDefault();
        onChange(TFNG_OPTIONS[next].value);
        refs.current[next]?.focus();
    }

    return (
        <div role="radiogroup" aria-labelledby={labelledBy} className="flex flex-col gap-2.5">
            {TFNG_OPTIONS.map((option, index) => {
                const selected = option.value === value;
                const focusable = selected || (selectedIndex === -1 && index === 0);
                return (
                    <button
                        key={option.value}
                        ref={(node) => {
                            refs.current[index] = node;
                        }}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        tabIndex={focusable ? 0 : -1}
                        disabled={disabled}
                        onClick={() => {
                            if (!selected) onChange(option.value);
                        }}
                        onKeyDown={(event) => handleKeyDown(event, index)}
                        className={cn(
                            "flex w-full items-center gap-3 rounded-field border px-4 py-[14px] text-left text-[15px] leading-[22px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed",
                            selected ? "border-primary bg-primary-soft" : "border-border bg-card",
                        )}
                    >
                        <span
                            aria-hidden
                            className={cn(
                                "grid size-[18px] shrink-0 place-items-center rounded-full border-2",
                                selected ? "border-primary" : "border-border",
                            )}
                        >
                            {selected && <span className="size-2 rounded-full bg-primary" />}
                        </span>
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}