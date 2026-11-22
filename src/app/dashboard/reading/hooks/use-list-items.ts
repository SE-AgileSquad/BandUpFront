"use client";

import { useEffect, useMemo, useState } from "react";
import { READING_PATHS } from "@/app/dashboard/reading/_shared/constants/reading";
import { remainingMs } from "@/app/dashboard/reading/_shared/lib/clock";
import { draftStore } from "@/app/dashboard/reading/_shared/storage/draft-store";
import type { Draft, PassageSummary } from "@/app/dashboard/reading/_shared/types";
import { useTicker } from "./use-ticker";

export type ListState =
    | { kind: "new" }
    | {
        kind: "in_progress";
        remainingMs: number;
        answered: number | null;
        questionNumber: number | null;
    }
    | { kind: "unsubmitted"; answered: number }
    | {
        kind: "completed";
        result: { correct: number; total: number } | null;
        href: string | null;
    };

export type ListItem = { passage: PassageSummary; state: ListState; draft: Draft | null };

export const countAnswered = (answers: Record<string, string>) =>
    Object.values(answers).filter((value) => value.trim()).length;

function deriveItem(
    passage: PassageSummary,
    drafts: Draft[],
    now: number,
    fetchedAt: number,
): ListItem {
    const draft = drafts.find((entry) => entry.passageId === passage.id) ?? null;

    if (draft) {
        const answered = countAnswered(draft.answers);
        if (draftStore.needsSubmit(draft, now)) {
            return { passage, draft, state: { kind: "unsubmitted", answered } };
        }
        return {
            passage,
            draft,
            state: {
                kind: "in_progress",
                remainingMs: remainingMs(draft.endsAt, draft.serverOffsetMs, now),
                answered,
                questionNumber: draft.currentIndex + 1,
            },
        };
    }

    if (passage.status === "in_progress" && passage.activeAttempt) {
        const remaining =
            Date.parse(passage.activeAttempt.endsAt) -
            (Date.parse(passage.activeAttempt.serverNow) + (now - fetchedAt));
        if (remaining > 0) {
            return {
                passage,
                draft: null,
                state: { kind: "in_progress", remainingMs: remaining, answered: null, questionNumber: null },
            };
        }
    }

    if (passage.status === "completed") {
        return {
            passage,
            draft: null,
            state: {
                kind: "completed",
                result: passage.lastResult ?? null,
                href: passage.lastAttemptId
                    ? READING_PATHS.result(passage.id, passage.lastAttemptId)
                    : null,
            },
        };
    }

    return { passage, draft: null, state: { kind: "new" } };
}

type Options = {
    passages: PassageSummary[];
    dataUpdatedAt: number;
    userId: string | null;
};

export function useListItems({ passages, dataUpdatedAt, userId }: Options) {
    const [drafts, setDrafts] = useState<Draft[]>([]);

    useEffect(() => {
        if (!userId) return;
        const refresh = () => setDrafts(draftStore.listForUser(userId));
        refresh();
        return draftStore.subscribe(refresh);
    }, [userId]);

    const live =
        drafts.some((draft) => draft.status === "in_progress") ||
        passages.some((passage) => passage.status === "in_progress");
    const now = useTicker(live);

    return useMemo(
        () => passages.map((passage) => deriveItem(passage, drafts, now, dataUpdatedAt)),
        [passages, drafts, now, dataUpdatedAt],
    );
}