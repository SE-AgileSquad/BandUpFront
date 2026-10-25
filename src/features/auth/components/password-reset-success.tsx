"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LOGIN_PATH } from "../constants/auth.constants";
import { AUTH_SUBMIT_CLASSNAME } from "../constants/auth.styles";
import { AuthHeader } from "./auth-header";

export function PasswordResetSuccess() {
    const linkRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        linkRef.current?.focus();
    }, []);

    return (
        <div className="flex flex-col items-center gap-6">
            <span className="flex size-12 items-center justify-center rounded-full bg-success-bg text-success">
                <Check className="size-6" aria-hidden="true" />
            </span>
            <AuthHeader
                title="Password updated"
                description="You can now sign in with your new password."
            />
            <Link
                ref={linkRef}
                href={LOGIN_PATH}
                className={cn(buttonVariants(), AUTH_SUBMIT_CLASSNAME)}
            >
                Back to sign in
            </Link>
        </div>
    );
}