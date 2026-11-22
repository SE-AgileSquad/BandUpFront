"use client";

import { formatClockFromMs } from "@/app/dashboard/reading/_shared/lib/format-time";
import { cn } from "@/lib/utils";
import { LIST_COPY } from "../constants/list";
import type { ListItem, ListState } from "../hooks/use-list-items";
import { PassageImage } from "./passage-image";

const BADGE_STYLES: Record<ListState["kind"], string> = {
    new: "bg-primary-soft text-primary",
    in_progress: "bg-warning-soft text-warning-soft-foreground",
    unsubmitted: "bg-warning-soft text-warning-soft-foreground",
    completed: "bg-success-bg text-success",
};

function metaFor(item: ListItem) {
    const { passage, state } = item;
    const { meta } = LIST_COPY;

    switch (state.kind) {
        case "new":
            return meta.fresh(passage.questionCount, passage.durationMinutes);
        case "in_progress":
            return meta.inProgress(formatClockFromMs(state.remainingMs), passage.questionCount);
        case "unsubmitted":
            return meta.unsubmitted;
        case "completed":
            return state.result
                ? meta.completed(state.result.correct, state.result.total)
                : LIST_COPY.badges.completed;
    }
}

type PassageCardProps = { item: ListItem; onSelect: (item: ListItem) => void };

export function PassageCard({ item, onSelect }: PassageCardProps) {
    const { passage, state } = item;
    const disabled = state.kind === "completed" && !state.href;

    return (
        <button
            type="button"
            disabled={disabled}
            onClick={() => onSelect(item)}
            className="flex w-full flex-col gap-[10px] rounded-card border border-border bg-card p-3 text-left outline-none transition-colors hover:bg-primary-soft/40 focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-70"
        >
            <PassageImage src={passage.imageUrl} />
            <span className="text-[18px] leading-[26px] font-bold text-foreground">
                {passage.title}
            </span>
            <span className="text-[13px] leading-[1.4] text-muted-foreground">{metaFor(item)}</span>
            <span className="mt-1 flex items-center justify-between gap-2">
                <span
                    className={cn(
                        "rounded-pill px-[10px] py-1 text-[12px] leading-[1.4] font-semibold",
                        BADGE_STYLES[state.kind],
                    )}
                >
                    {LIST_COPY.badges[state.kind]}
                </span>
                <span className="text-[14px] leading-[21px] font-semibold text-primary">
                    {LIST_COPY.actions[state.kind]} ›
                </span>
            </span>
        </button>
    );
}
