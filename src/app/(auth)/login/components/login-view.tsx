"use client";

import { useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { LOGIN_COPY } from "../constants/login";
import { useLoginFlow, useLoginFlowReady } from "../hooks/use-login-flow";
import type { LoginMethod, LoginViewProps } from "../types";
import { LoginMethodTabs } from "./login-method-tabs";
import { PasswordLoginForm } from "./password-login-form";
import { SessionNotice } from "./session-notice";
import { SmsLoginForm } from "./sms-login-form";

function FormPlaceholder() {
    return <div aria-hidden className="min-h-[360px]" />;
}

export function LoginView({ next, reason, method: initialMethod }: LoginViewProps) {
    const ready = useLoginFlowReady();
    const [method, setMethod] = useState<LoginMethod>(initialMethod);

    function handleMethodChange(nextMethod: LoginMethod) {
        setMethod(nextMethod);
        useLoginFlow.getState().setMethod(nextMethod);
    }

    return (
        <>
            <div className="flex flex-col gap-2">
                <h1 className="text-auth-title">{LOGIN_COPY.title}</h1>
                <p className="text-[15px] leading-[22px] text-muted-foreground">
                    {LOGIN_COPY.subtitle}
                </p>
            </div>

            <SessionNotice reason={reason} next={next} />

            <LoginMethodTabs
                value={method}
                onValueChange={handleMethodChange}
                password={ready ? <PasswordLoginForm next={next} /> : <FormPlaceholder />}
                sms={ready ? <SmsLoginForm next={next} /> : <FormPlaceholder />}
            />

            <p className="flex items-center justify-center gap-1.5 text-[14px] leading-[21px]">
                <span className="text-muted-foreground">{LOGIN_COPY.signUp.prompt}</span>
                <Link
                    href={ROUTES.REGISTER}
                    className="rounded-sm font-semibold text-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-primary/25"
                >
                    {LOGIN_COPY.signUp.link}
                </Link>
            </p>
        </>
    );
}