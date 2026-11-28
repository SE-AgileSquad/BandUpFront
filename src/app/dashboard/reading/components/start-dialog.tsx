"use client";

import { ReadingDialog } from "@/app/dashboard/reading/_shared/components/reading-dialog";
import { Button } from "@/components/ui/button";
import { Hourglass } from "react-loader-spinner";
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
            <div className="mx-auto flex size-[120px] items-center justify-center" aria-hidden="true">
                <Hourglass
                    visible={open}
                    height="88"
                    width="88"
                    ariaLabel="hourglass-loading"
                    colors={["#8b5cf6", "#c4b5fd"]}
                />
            </div>
            <p className="text-[13.5px] leading-[1.6] text-foreground">{copy.hint}</p>
        </ReadingDialog>
    );
}
