"use client";

import { useMemo } from "react";
import { READING_PATHS } from "@/app/dashboard/reading/_shared/constants/reading";
import type { PassageSummary } from "@/app/dashboard/reading/_shared/types";
import { useTicker } from "./use-ticker";

export type ListState =
    | { kind: "new" }
    | { kind: "in_progress"; remainingMs: number; answered: null; questionNumber: null }
    | { kind: "completed"; result: { correct: number; total: number } | null; href: string | null };

export type ListItem = { passage: PassageSummary; state: ListState };

function deriveItem(passage: PassageSummary, now: number, fetchedAt: number): ListItem {
    if (passage.status === "completed") {
        return {
            passage,
            state: {
                kind: "completed",
                result: passage.lastResult ?? null,
                href: passage.lastAttemptId ? READING_PATHS.result(passage.id, passage.lastAttemptId) : null,
            },
        };
    }

    if (passage.status === "in_progress" && passage.activeAttempt) {
        const remainingMs = Date.parse(passage.activeAttempt.endsAt) -
            (Date.parse(passage.activeAttempt.serverNow) + (now - fetchedAt));
        if (remainingMs > 0) {
            return { passage, state: { kind: "in_progress", remainingMs, answered: null, questionNumber: null } };
        }
    }

    return { passage, state: { kind: "new" } };
}

type Options = { passages: PassageSummary[]; dataUpdatedAt: number };

export function useListItems({ passages, dataUpdatedAt }: Options) {
    const live = passages.some((passage) => passage.status === "in_progress");
    const now = useTicker(live);
    return useMemo(
        () => passages.map((passage) => deriveItem(passage, now, dataUpdatedAt)),
        [passages, now, dataUpdatedAt],
    );
}
