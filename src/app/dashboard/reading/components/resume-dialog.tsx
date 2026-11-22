"use client";

import { ReadingDialog } from "@/app/dashboard/reading/_shared/components/reading-dialog";
import { formatClockFromMs } from "@/app/dashboard/reading/_shared/lib/format-time";
import { ImageSlot } from "@/components/shared/image-slot";
import { Button } from "@/components/ui/button";
import { LIST_COPY } from "../constants/list";
import type { ListItem } from "../hooks/use-list-items";

type ResumeDialogProps = {
    item: ListItem | null;
    onConfirm: () => void;
    onClose: () => void;
};

export function ResumeDialog({ item, onConfirm, onClose }: ResumeDialogProps) {
    const copy = LIST_COPY.resume;
    const state = item?.state.kind === "in_progress" ? item.state : null;

    return (
        <ReadingDialog
            open={Boolean(item && state)}
            onClose={onClose}
            title={copy.title}
            description={
                state
                    ? copy.text(
                        formatClockFromMs(state.remainingMs),
                        state.answered,
                        item?.passage.questionCount ?? 10,
                    )
                    : ""
            }
            actions={
                <>
                    <Button type="button" variant="gradient" size="default" className="w-full" onClick={onConfirm}>
                        {copy.confirm}
                    </Button>
                    <Button type="button" variant="outline" size="default" className="w-full" onClick={onClose}>
                        {copy.cancel}
                    </Button>
                </>
            }
        >
            <div className="relative mx-auto size-24">
                <ImageSlot src={undefined} alt={copy.imageAlt} sizes="96px" className="rounded-frame" />
            </div>
            {item && state && (
                <p className="text-[13.5px] leading-[1.6] font-semibold text-foreground">
                    {copy.line(item.passage.title, state.questionNumber)}
                </p>
            )}
        </ReadingDialog>
    );
}