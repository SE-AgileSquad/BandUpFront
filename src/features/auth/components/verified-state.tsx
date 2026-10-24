"use client";

import { Check } from "lucide-react";
import { useVerifiedRedirect } from "../hooks/use-verified-redirect";
import { AuthHeader } from "./auth-header";

export function VerifiedState() {
    useVerifiedRedirect();

    return (
        <div role="status" className="flex flex-col items-center gap-6">
            <span className="flex size-14 items-center justify-center rounded-full bg-accent text-primary">
                <Check className="size-7" aria-hidden="true" />
            </span>
            <AuthHeader
                title="Email verified"
                description="Taking you to your dashboard…"
            />
        </div>
    );
}