"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StatusNotice } from "@/components/auth/status-notice";
import { ImageSlot } from "@/components/shared/image-slot";
import { ROUTES } from "@/constants/routes";
import { FORGOT_COPY } from "../constants/forgot";
import { useForgotFlow, useForgotFlowReady } from "../hooks/use-forgot-flow";

export function SuccessView() {
    const router = useRouter();
    const ready = useForgotFlowReady();
    const handled = useRef(false);
    const [maskedEmail, setMaskedEmail] = useState<string | null>(null);

    useEffect(() => {
        if (!ready || handled.current) return;
        handled.current = true;

        const { completed, completedMaskedEmail, reset } = useForgotFlow.getState();
        if (!completed) {
            router.replace(ROUTES.FORGOT_PASSWORD);
            return;
        }
        setMaskedEmail(completedMaskedEmail);
        reset();
    }, [ready, router]);

    if (maskedEmail === null) return <div aria-hidden className="min-h-[420px]" />;

    const copy = FORGOT_COPY.success;

    return (
        <>
            <div className="flex flex-col gap-2">
                <h1 className="text-auth-title">{copy.title}</h1>
                <p className="text-[15px] leading-[22px] text-muted-foreground">
                    {copy.subtitle}
                </p>
            </div>

            <div className="relative mx-auto size-[120px]">
                <ImageSlot
                    src="/images/auth/img_passchanged.png"
                    alt={copy.imageAlt}
                    sizes="120px"
                    className="rounded-frame"
                />
            </div>

            <StatusNotice
                variant="success"
                title={copy.noticeTitle}
                description={copy.noticeDescription(maskedEmail)}
            />

            <Button asChild variant="gradient" size="default" className="w-full">
                <Link href={ROUTES.LOGIN}>{copy.cta}</Link>
            </Button>
        </>
    );
}
