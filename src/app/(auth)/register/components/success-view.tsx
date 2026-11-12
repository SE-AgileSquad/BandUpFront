"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StatusNotice } from "@/components/auth/status-notice";
import { ImageSlot } from "@/components/shared/image-slot";
import { ROUTES } from "@/constants/routes";
import { SUCCESS_COPY } from "../constants/register";
import { useRegisterFlow, useRegisterFlowReady } from "../hooks/use-register-flow";

export function SuccessView() {
    const router = useRouter();
    const ready = useRegisterFlowReady();
    const handled = useRef(false);
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
        if (!ready || handled.current) return;
        handled.current = true;

        if (!useRegisterFlow.getState().verified) {
            router.replace(ROUTES.REGISTER);
            return;
        }
        setAllowed(true);
        useRegisterFlow.getState().reset();
    }, [ready, router]);

    if (!allowed) return <div aria-hidden className="min-h-[480px]" />;

    return (
        <>
            <div className="flex flex-col gap-2">
                <h1 className="text-auth-title">{SUCCESS_COPY.title}</h1>
                <p className="text-[15px] leading-[22px] text-muted-foreground">
                    {SUCCESS_COPY.subtitle}
                </p>
            </div>

            <div className="relative mx-auto size-[180px]">
                <ImageSlot
                    src={undefined}
                    alt={SUCCESS_COPY.imageAlt}
                    sizes="180px"
                    className="rounded-frame"
                />
            </div>

            <StatusNotice
                variant="success"
                title={SUCCESS_COPY.notice.title}
                description={SUCCESS_COPY.notice.description}
            />

            <Button asChild variant="gradient" size="default" className="w-full">
                <Link href={ROUTES.DASHBOARD}>{SUCCESS_COPY.cta}</Link>
            </Button>
        </>
    );
}
