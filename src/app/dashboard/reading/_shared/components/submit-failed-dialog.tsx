"use client";

import { Button } from "@/components/ui/button";
import { SHARED_COPY } from "../constants/reading";
import { DialogChip, ReadingDialog } from "./reading-dialog";

type SubmitFailedDialogProps = {
    open: boolean;
    answered: number;
    canReturnToTest: boolean;
    onRetry: () => void;
    onSecondary: () => void;
};

export function SubmitFailedDialog({
    open,
    answered,
    canReturnToTest,
    onRetry,
    onSecondary,
}: SubmitFailedDialogProps) {
    const copy = SHARED_COPY.failed;

    return (
        <ReadingDialog
            open={open}
            dismissible={false}
            title={copy.title}
            description={copy.text(answered)}
            actions={
                <>
                    <Button type="button" variant="gradient" size="default" className="w-full" onClick={onRetry}>
                        {copy.retry}
                    </Button>
                    <Button
                        type="button"
                        variant="brand-outline"
                        size="default"
                        className="w-full"
                        onClick={onSecondary}
                    >
                        {canReturnToTest ? copy.backToTest : copy.backToList}
                    </Button>
                </>
            }
        >
            <DialogChip>{SHARED_COPY.chipSaved}</DialogChip>
        </ReadingDialog>
    );
}