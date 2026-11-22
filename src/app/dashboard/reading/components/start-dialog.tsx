"use client";

import { ReadingDialog } from "@/app/dashboard/reading/_shared/components/reading-dialog";
import { ImageSlot } from "@/components/shared/image-slot";
import { Button } from "@/components/ui/button";
import { LIST_COPY } from "../constants/list";

type StartDialogProps = { open: boolean; onConfirm: () => void; onClose: () => void };

export function StartDialog({ open, onConfirm, onClose }: StartDialogProps) {
    const copy = LIST_COPY.start;

    return (
        <ReadingDialog
            open={open}
            onClose={onClose}
            title={copy.title}
            description={copy.text}
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
            <div className="relative mx-auto size-[120px]">
                <ImageSlot src={undefined} alt={copy.imageAlt} sizes="120px" className="rounded-frame" />
            </div>
            <p className="text-[13.5px] leading-[1.6] text-foreground">{copy.hint}</p>
        </ReadingDialog>
    );
}