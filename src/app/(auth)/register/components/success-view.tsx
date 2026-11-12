"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";
import { Loader2 } from "lucide-react";
import { StatusNotice } from "@/components/auth/status-notice";
import { ImageSlot } from "@/components/shared/image-slot";
import { useAutoContinue } from "@/hooks/use-auto-continue";
import { ROUTES } from "@/constants/routes";
import { refreshAuth } from "@/lib/auth-api";
import { SUCCESS_COPY } from "../constants/register";
import { useRegisterFlow, useRegisterFlowReady } from "../hooks/use-register-flow";

export function SuccessView() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const ready = useRegisterFlowReady();
    const handled = useRef(false);
    const [allowed, setAllowed] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateWindowSize = () =>
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });

        updateWindowSize();
        window.addEventListener("resize", updateWindowSize);
        return () => window.removeEventListener("resize", updateWindowSize);
    }, []);

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

    useAutoContinue(allowed, async () => {
        await refreshAuth(queryClient);
        router.replace(ROUTES.DASHBOARD);
    });

    if (!allowed) return <div aria-hidden className="min-h-[480px]" />;

    return (
        <>
            {windowSize.width > 0 && (
                <Confetti
                    width={windowSize.width}
                    height={windowSize.height}
                    numberOfPieces={250}
                    recycle={false}
                    gravity={0.3}
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 50,
                        pointerEvents: "none",
                    }}
                />
            )}

            <div className="flex flex-col gap-2">
                <h1 className="text-auth-title">{SUCCESS_COPY.title}</h1>
                <p className="text-[15px] leading-[22px] text-muted-foreground">
                    {SUCCESS_COPY.subtitle}
                </p>
            </div>

            <div className="relative mx-auto size-[250px]">
                <ImageSlot
                    src={SUCCESS_COPY.imageSrc}
                    alt={SUCCESS_COPY.imageAlt}
                    sizes="250px"
                    className="rounded-frame"
                />
            </div>

            <StatusNotice
                variant="success"
                title={SUCCESS_COPY.notice.title}
                description={SUCCESS_COPY.notice.description}
            />

            <p
                role="status"
                className="flex items-center justify-center gap-2 text-[14px] leading-[21px] text-muted-foreground"
            >
                <Loader2 aria-hidden className="size-4 animate-spin" />
                {SUCCESS_COPY.redirecting}
            </p>
        </>
    );
}
