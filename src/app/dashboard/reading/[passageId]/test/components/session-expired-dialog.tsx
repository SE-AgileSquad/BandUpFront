"use client";

import {
    DialogChip,
    ReadingDialog,
} from "@/app/dashboard/reading/_shared/components/reading-dialog";
import { Button } from "@/components/ui/button";
import { TEST_COPY } from "../constants/test";

type SessionExpiredDialogProps = {
    open: boolean;
    title: string;
    questionNumber: number;
    onSignIn: () => void;
};

export function SessionExpiredDialog({
    open,
    title,
    questionNumber,
    onSignIn,
}: SessionExpiredDialogProps) {
    const copy = TEST_COPY.sessionExpired;

    return (
        <ReadingDialog
            open={open}
            dismissible={false}
            title={copy.title}
            description={copy.text(title, questionNumber)}
            actions={
                <Button type="button" variant="gradient" size="default" className="w-full" onClick={onSignIn}>
                    {copy.action}
                </Button>
            }
        >
            <DialogChip>{copy.chip}</DialogChip>
            <p className="text-[13px] leading-[1.4] text-muted-foreground">{copy.destination}</p>
        </ReadingDialog>
    );
}