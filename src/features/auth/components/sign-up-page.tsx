"use client";

import { useSignUpFlow } from "@/features/auth/hooks/use-sign-up-flow";
import { maskEmail } from "@/features/auth/utils/mask-email";
import { AuthHeader } from "@/features/auth/components/auth-header";
import { SignUpForm } from "@/features/auth/components/sign-up-form";
import { VerifiedState } from "@/features/auth/components/verified-state";
import { VerifyEmailForm } from "@/features/auth/components/verify-email-form";

export default function SignUpPage() {
    const flow = useSignUpFlow();

    if (!flow.isReady) {
        return null;
    }

    if (flow.step === "verified") {
        return <VerifiedState />;
    }

    if (flow.step === "verify") {
        return (
            <>
                <AuthHeader
                    title="Check your email"
                    description={`We sent a 6-digit code to ${maskEmail(flow.email)}.`}
                />
                <VerifyEmailForm
                    email={flow.email}
                    resendEndsAt={flow.resendEndsAt}
                    onResendEndsAtChange={flow.updateResendEndsAt}
                    onVerified={flow.markVerified}
                    onChangeEmail={flow.changeEmail}
                />
            </>
        );
    }

    return (
        <>
            <AuthHeader
                title="Create your account"
                description="Start with 3 free credits for Writing feedback."
            />
            <SignUpForm
                defaultValues={{ displayName: flow.displayName, email: flow.email }}
                onRegistered={flow.startVerification}
            />
        </>
    );
}