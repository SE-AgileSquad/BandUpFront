"use client";

import { cn } from "@/lib/utils";
import { useMockUserState } from "../hooks/use-mock-user-state";
import type { DashboardUserState } from "../types/dashboard.types";

const OPTIONS: readonly { value: DashboardUserState; label: string }[] = [
    { value: "new", label: "New user" },
    { value: "returning", label: "Returning user" },
];

export function DevStateSwitcher() {
    const { state, setState } = useMockUserState();

    return (
        <div className="fixed bottom-[84px] right-4 z-50 flex items-center gap-1 rounded-full bg-foreground p-1 text-small text-background lg:bottom-4">
            {OPTIONS.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    aria-pressed={state === option.value}
                    onClick={() => setState(option.value)}
                    className={cn(
                        "rounded-full px-3 py-1 outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        state === option.value && "bg-background text-foreground",
                    )}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}