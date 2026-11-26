"use client";

import { ReadingDialog } from "@/app/dashboard/reading/_shared/components/reading-dialog";
import { Button } from "@/components/ui/button";
import { LIST_COPY } from "../constants/list";
import type { ListItem } from "../hooks/use-list-items";

type CompletedTestDialogProps = {
    item: ListItem | null;
    onClose: () => void;
    onRetake: () => void;
    onReview: () => void;
};

export function CompletedTestDialog({ item, onClose, onRetake, onReview }: CompletedTestDialogProps) {
    const copy = LIST_COPY.completedDialog;

    return (
        <ReadingDialog
            open={item?.state.kind === "completed"}
            onClose={onClose}
            title={copy.title}
            description={item ? copy.description(item.passage.title) : ""}
            actions={
                <>
                    <Button type="button" variant="gradient" size="default" className="w-full" onClick={onRetake}>
                        {copy.retake}
                    </Button>
                    <Button
                        type="button"
                        variant="brand-outline"
                        size="default"
                        className="w-full"
                        disabled={item?.state.kind !== "completed" || !item.state.href}
                        onClick={onReview}
                    >
                        {copy.review}
                    </Button>
                </>
            }
        />
    );
}
