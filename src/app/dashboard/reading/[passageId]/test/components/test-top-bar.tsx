"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TEST_COPY } from "../constants/test";
import { TimerPill } from "./timer-pill";

type TestTopBarProps = {
    answered: number;
    total: number;
    remainingSeconds: number | null;
    locked: boolean;
    onLeave: () => void;
    onSubmit: () => void;
};

function BrandMark() {
    return (
        <div className="flex items-center gap-[10px]">
            <span
                aria-hidden
                className="grid size-10 place-items-center rounded-logo bg-primary text-[22px] leading-none font-bold text-primary-foreground"
            >
                B
            </span>
            <span className="text-logo text-foreground">BandUp</span>
        </div>
    );
}

export function TestTopBar({
    answered,
    total,
    remainingSeconds,
    locked,
    onLeave,
    onSubmit,
}: TestTopBarProps) {
    const submitLabel = locked ? TEST_COPY.submitting : TEST_COPY.submit;

    return (
        <header className="sticky top-0 z-20 border-b border-border bg-card lg:static">
            <div className="hidden items-center justify-between px-10 py-[14px] lg:flex">
                <BrandMark />
                <p className="text-[15px] leading-[22px] font-semibold">
                    {TEST_COPY.answered(answered, total)}
                </p>
                <div className="flex items-center gap-3">
                    <TimerPill seconds={remainingSeconds} />
                    <Button
                        type="button"
                        variant="brand-outline"
                        size="default"
                        disabled={locked}
                        onClick={onLeave}
                    >
                        {TEST_COPY.leave}
                    </Button>
                    <Button type="button" variant="gradient" size="default" disabled={locked} onClick={onSubmit}>
                        {submitLabel}
                    </Button>
                </div>
            </div>

            <div className="flex items-center justify-between gap-2 px-4 py-3 lg:hidden">
                <Button
                    type="button"
                    variant="brand-outline"
                    size="icon"
                    className="size-10 rounded-btn"
                    aria-label={TEST_COPY.leave}
                    disabled={locked}
                    onClick={onLeave}
                >
                    <X aria-hidden className="size-5" />
                </Button>
                <p className="text-[14px] leading-[21px] font-semibold">
                    {TEST_COPY.answered(answered, total)}
                </p>
                <TimerPill seconds={remainingSeconds} />
                <Button
                    type="button"
                    variant="gradient"
                    size="sm"
                    className="h-10 rounded-btn px-4 font-semibold"
                    disabled={locked}
                    onClick={onSubmit}
                >
                    {submitLabel}
                </Button>
            </div>
        </header>
    );
}