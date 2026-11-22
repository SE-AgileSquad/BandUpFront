"use client";

import {
    DialogChip,
    ReadingDialog,
} from "@/app/dashboard/reading/_shared/components/reading-dialog";
import { Button } from "@/components/ui/button";
import { TEST_COPY } from "../constants/test";

type SubmitConfirmDialogProps = {
    open: boolean;
    answered: number;
    total: number;
    onConfirm: () => void;
    onClose: () => void;
};

export function SubmitConfirmDialog({
    open,
    answered,
    total,
    onConfirm,
    onClose,
}: SubmitConfirmDialogProps) {
    const copy = TEST_COPY.confirm;
    const unanswered = total - answered;

    return (
        <ReadingDialog
            open={open}
            onClose={onClose}
            title={copy.title}
            description={copy.text(answered, unanswered, total)}
            actions={
                <>
                    <Button type="button" variant="gradient" size="default" className="w-full" onClick={onConfirm}>
                        {copy.submit}
                    </Button>
                    <Button type="button" variant="outline" size="default" className="w-full" onClick={onClose}>
                        {copy.back}
                    </Button>
                </>
            }
        >
            <DialogChip>{copy.chip(answered, unanswered)}</DialogChip>
        </ReadingDialog>
    );
}