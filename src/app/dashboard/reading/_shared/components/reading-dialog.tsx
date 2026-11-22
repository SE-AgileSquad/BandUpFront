"use client";

import type { ReactNode } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog";

type ReadingDialogProps = {
    open: boolean;
    title: string;
    description: string;
    dismissible?: boolean;
    onClose?: () => void;
    actions?: ReactNode;
    children?: ReactNode;
};

export function ReadingDialog({
    open,
    title,
    description,
    dismissible = true,
    onClose,
    actions,
    children,
}: ReadingDialogProps) {
    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                if (!next && dismissible) onClose?.();
            }}
        >
            <DialogContent
                onEscapeKeyDown={(event) => {
                    if (!dismissible) event.preventDefault();
                }}
                onInteractOutside={(event) => {
                    if (!dismissible) event.preventDefault();
                }}
                className="max-w-[400px] gap-0 rounded-card p-5 sm:max-w-[400px] [&>button:last-child]:hidden"
            >
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3 rounded-frame border border-border p-5">
                        <DialogTitle className="text-[18px] leading-[26px] font-semibold">
                            {title}
                        </DialogTitle>
                        <DialogDescription className="text-[13.5px] leading-[1.6] text-muted-foreground">
                            {description}
                        </DialogDescription>
                        {children}
                    </div>
                    {actions && <div className="flex flex-col gap-2.5">{actions}</div>}
                </div>
            </DialogContent>
        </Dialog>
    );
}

export function DialogChip({ children }: { children: ReactNode }) {
    return (
        <span className="inline-flex self-start rounded-pill bg-warning-soft px-3 py-1 text-[12px] leading-[1.4] font-semibold text-warning-soft-foreground">
            {children}
        </span>
    );
}