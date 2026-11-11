"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import type { AuthCtaContent } from "../types";

type AuthCtaProps = {
    content: AuthCtaContent;
    variant: "gradient" | "on-gradient";
};

export function AuthCta({ content, variant }: AuthCtaProps) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <span aria-hidden className="invisible inline-flex">
                <Button asChild variant={variant} tabIndex={-1}>
                    <Link href={content.guest.href}>{content.guest.label}</Link>
                </Button>
            </span>
        );
    }

    const target = isAuthenticated ? content.authed : content.guest;

    return (
        <Button asChild variant={variant}>
            <Link href={target.href}>{target.label}</Link>
        </Button>
    );
}