"use client";

import { X } from "lucide-react";
import { Logo } from "@/components/layout/logo";
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
        <header className="sticky top-0 z-30 border-b border-border bg-card lg:fixed lg:inset-x-0 lg:top-0">
            <div className="hidden h-[68px] items-center justify-between px-4 lg:flex">
                <Logo />
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
