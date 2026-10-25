"use client";

import { useState } from "react";
import { maskEmail } from "../utils/mask-email";
import { AuthHeader } from "./auth-header";
import { NewPasswordForm } from "./new-password-form";
import { PasswordResetSuccess } from "./password-reset-success";
import { RequestResetForm } from "./request-reset-form";
import { ResetCodeForm } from "./reset-code-form";

type Step = "request" | "code" | "reset" | "done";

interface ForgotPasswordPageProps {
    initialEmail?: string;
}

const STEP_MIN_HEIGHT = "min-h-[420px]";
const CODE_EXPIRY_TEXT = "10 minutes";

const ANNOUNCEMENTS: Record<Step, string> = {
    request: "Enter your email to reset your password.",
    code: "Step 2 of 3. Enter the 6-digit code we sent you.",
    reset: "Step 3 of 3. Set a new password.",
    done: "Your password was updated.",
};

export default function ForgotPasswordPage({
    initialEmail = "",
}: ForgotPasswordPageProps) {
    const [step, setStep] = useState<Step>("request");
    const [email, setEmail] = useState(initialEmail);

    return (
        <div className={`flex flex-col gap-7 ${STEP_MIN_HEIGHT}`}>
            <p role="status" className="sr-only">
                {ANNOUNCEMENTS[step]}
            </p>

            {step === "request" && (
                <>
                    <AuthHeader
                        title="Forgot your password?"
                        description="Enter your email and we'll send you a 6-digit code to reset it."
                    />
                    <RequestResetForm
                        initialEmail={email}
                        onSubmit={(value) => {
                            setEmail(value);
                            setStep("code");
                        }}
                    />
                </>
            )}

            {step === "code" && (
                <>
                    <AuthHeader
                        title="Check your email"
                        description={`If an account exists for ${maskEmail(email)}, we sent a 6-digit code. It expires in ${CODE_EXPIRY_TEXT}.`}
                    />
                    <ResetCodeForm
                        onSubmit={() => setStep("reset")}
                        onResend={() => undefined}
                        onChangeEmail={() => setStep("request")}
                    />
                </>
            )}

            {step === "reset" && (
                <>
                    <AuthHeader
                        title="Set a new password"
                        description="Choose a strong password you haven't used before."
                    />
                    <NewPasswordForm
                        onSubmit={() => setStep("done")}
                        onRestart={() => setStep("request")}
                    />
                </>
            )}

            {step === "done" && <PasswordResetSuccess />}
        </div>
    );
}