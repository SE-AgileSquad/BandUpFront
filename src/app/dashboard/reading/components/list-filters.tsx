"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { LIST_COPY, type FilterKey } from "../constants/list";

type ListFiltersProps = { value: FilterKey; onChange: (value: FilterKey) => void };

export function ListFilters({ value, onChange }: ListFiltersProps) {
    const refs = useRef<(HTMLButtonElement | null)[]>([]);
    const filters = LIST_COPY.filters;

    function handleKeyDown(event: React.KeyboardEvent, index: number) {
        const last = filters.length - 1;
        let next = index;

        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
            next = index === last ? 0 : index + 1;
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
            next = index === 0 ? last : index - 1;
        } else if (event.key === "Home") {
            next = 0;
        } else if (event.key === "End") {
            next = last;
        } else {
            return;
        }

        event.preventDefault();
        onChange(filters[next].key);
        refs.current[next]?.focus();
    }

    return (
        <div
            role="radiogroup"
            aria-label={LIST_COPY.filtersLabel}
            className="flex flex-wrap gap-2"
        >
            {filters.map((filter, index) => {
                const active = filter.key === value;
                return (
                    <button
                        key={filter.key}
                        ref={(node) => {
                            refs.current[index] = node;
                        }}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        tabIndex={active ? 0 : -1}
                        onClick={() => onChange(filter.key)}
                        onKeyDown={(event) => handleKeyDown(event, index)}
                        className={cn(
                            "rounded-pill border px-4 py-[9px] text-[14px] leading-[21px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                            active
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-card text-muted-foreground",
                        )}
                    >
                        {filter.label}
                    </button>
                );
            })}
        </div>
    );
}