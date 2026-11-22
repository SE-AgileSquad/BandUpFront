"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SHARED_COPY } from "../constants/reading";
import type { SubmitReason } from "../types";
import { ReadingDialog } from "./reading-dialog";

type SubmittingDialogProps = {
    open: boolean;
    reason: SubmitReason;
    unanswered?: number;
};

export function SubmittingDialog({ open, reason, unanswered = 0 }: SubmittingDialogProps) {
    const copy = SHARED_COPY.submitting;
    const timeup = reason === "timeup";

    return (
        <ReadingDialog
            open={open}
            dismissible={false}
            title={timeup ? copy.timeupTitle : copy.manualTitle}
            description={timeup ? copy.timeupText(unanswered) : copy.manualText}
            actions={
                <Button type="button" variant="gradient" size="default" className="w-full" disabled>
                    <Loader2 aria-hidden className="size-5 motion-safe:animate-spin" />
                    {copy.button}
                </Button>
            }
        >
            <p className="text-[13px] leading-[1.4] font-medium text-foreground">{copy.saving}</p>
            <div
                role="progressbar"
                aria-label={copy.progressLabel}
                className="h-2 overflow-hidden rounded-pill bg-primary-soft"
            >
                <div className="h-full w-2/3 rounded-pill bg-primary motion-safe:animate-pulse" />
            </div>
        </ReadingDialog>
    );
}