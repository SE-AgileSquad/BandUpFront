import type { ImageSlotProps } from "@/components/shared/image-slot";

export const FORGOT_METADATA = {
    email: "Forgot password · BandUp",
    newPassword: "Choose a new password · BandUp",
    verify: "Verify your email · BandUp",
    success: "Password updated · BandUp",
} as const;

export const FORGOT_LIMITS = {
    codeLength: 5,
    passwordMin: 8,
    resendCooldownMs: 60_000,
    codeTtlMs: 5 * 60_000,
    lockMs: 15 * 60_000,
    maxWrongAttempts: 3,
} as const;

export const MOCK_VALID_CODE = "12345";
export const MOCK_EXPIRED_CODE = "00000";
export const MOCK_REJECTED_PASSWORD = "Password1";

export const FORGOT_PANEL: {
    headline: string;
    mascot: { src: ImageSlotProps["src"]; alt: string };
} = {
    headline: "Pick up right where you left off.",
    mascot: { src: "/images/auth/img_forgotpass.png", alt: "BandUp mascot" },
};

export const FORGOT_COPY = {
    email: {
        title: "Forgot your password?",
        subtitle: "We’ll send a verification code to your email.",
        label: "Email",
        placeholder: "you@example.com",
        helper: "We’ll only use this email for account recovery.",
        errors: {
            email: "Enter a valid email address.",
            captcha: "Complete the CAPTCHA to continue.",
        },
        submit: "Send code",
        sending: "Sending…",
        back: "Back to sign in",
        rateLimited: {
            title: "Too many attempts",
            description: "Please wait a few minutes and try again.",
        },
        generalError: {
            title: "Something went wrong",
            description:
                "We couldn’t reach BandUp. Check your connection and try again.",
        },
    },
    newPassword: {
        title: "Choose a new password",
        subtitle: "Make it strong, and keep it just for BandUp.",
        newLabel: "New password",
        newPlaceholder: "At least 8 characters",
        newHelper: "At least 8 characters.",
        confirmLabel: "Confirm new password",
        errors: {
            length: "Use at least 8 characters.",
            mix: "Include both letters and numbers.",
            mismatch: "Passwords don’t match.",
        },
        submit: "Save new password",
        back: "Back to sign in",
    },
    verify: {
        changeLabel: "Change email",
        passwordFallback: "Choose a different password.",
        verifyError: {
            title: "Something went wrong",
            description:
                "We couldn’t verify your code. Check your connection and try again.",
        },
        resendError: {
            title: "Something went wrong",
            description:
                "We couldn’t send a new code. Check your connection and try again.",
        },
    },
    success: {
        title: "Password updated",
        subtitle: "Use your new password to sign in securely.",
        imageAlt: "BandUp mascot celebrating",
        noticeTitle: "Password saved securely",
        noticeDescription: (maskedEmail: string) =>
            `Your email address remains ${maskedEmail}.`,
        cta: "Back to sign in",
    },
} as const;
