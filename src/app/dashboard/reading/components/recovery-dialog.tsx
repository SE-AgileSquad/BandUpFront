"use client";

import { SubmitFailedDialog } from "@/app/dashboard/reading/_shared/components/submit-failed-dialog";
import { SubmittingDialog } from "@/app/dashboard/reading/_shared/components/submitting-dialog";
import type { RecoveryState } from "../hooks/use-recovery";

type RecoveryDialogProps = {
    state: RecoveryState;
    onRetry: () => void;
    onDismiss: () => void;
};

export function RecoveryDialog({ state, onRetry, onDismiss }: RecoveryDialogProps) {
    return (
        <>
            <SubmittingDialog open={state.kind === "submitting"} reason="manual" />
            <SubmitFailedDialog
                open={state.kind === "failed"}
                answered={state.kind === "failed" ? state.answered : 0}
                canReturnToTest={false}
                onRetry={onRetry}
                onSecondary={onDismiss}
            />
        </>
    );
}