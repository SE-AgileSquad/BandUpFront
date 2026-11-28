"use client";

import {
    DialogChip,
    ReadingDialog,
} from "@/app/dashboard/reading/_shared/components/reading-dialog";
import { SHARED_COPY } from "@/app/dashboard/reading/_shared/constants/reading";
import { Button } from "@/components/ui/button";
import { TEST_COPY } from "../constants/test";

type LeaveDialogProps = {
    open: boolean;
    answered: number;
    onLeave: () => void;
    onStay: () => void;
};

export function LeaveDialog({ open, answered, onLeave, onStay }: LeaveDialogProps) {
    const copy = TEST_COPY.leaveDialog;

    return (
        <ReadingDialog
            open={open}
            onClose={onStay}
            title={copy.title}
            description={copy.text(answered)}
            actions={
                <>
                    <Button type="button" variant="gradient" size="default" className="w-full" onClick={onLeave}>
                        {copy.leave}
                    </Button>
                    <Button type="button" variant="outline" size="default" className="w-full" onClick={onStay}>
                        {copy.stay}
                    </Button>
                </>
            }
        >
            <DialogChip>{SHARED_COPY.chipSaved}</DialogChip>
        </ReadingDialog>
    );
}