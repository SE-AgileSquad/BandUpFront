import type { ImageSlotProps } from "@/components/shared/image-slot";

export const LOGIN_METADATA = {
    login: "Sign in · BandUp",
    verify: "Verify your email · BandUp",
} as const;

export const LOGIN_LIMITS = {
    codeLength: 6,
    resendCooldownMs: 60_000,
    codeTtlMs: 5 * 60_000,
    lockMs: 15 * 60_000,
    maxWrongAttempts: 3,
} as const;

export const MOCK_LOGIN_EMAIL = "student@bandup.test";
export const MOCK_LOGIN_PASSWORD = "Password1";
export const MOCK_VALID_CODE = "123456";
export const MOCK_EXPIRED_CODE = "000000";

export const LOGIN_PANEL: {
    headline: string;
    mascot: { src: ImageSlotProps["src"]; alt: string };
} = {
    headline: "Pick up right where you left off.",
    mascot: { src: "/images/auth/img_mascot_login.png", alt: "BandUp mascot" },
};

export const LOGIN_COPY = {
    title: "Welcome back",
    subtitle: "Sign in to pick up where you left off.",
    tabsLabel: "Sign-in method",
    tabs: { password: "Password", email: "Email code" },
    fields: {
        email: { label: "Email", placeholder: "you@example.com" },
        password: { label: "Password", placeholder: "Your password" },
    },
    errors: {
        email: "Check the email format.",
        password: "Enter your password.",
        captcha: "Complete the CAPTCHA to continue.",
    },
    forgot: "Forgot password?",
    submitPassword: "Sign in →",
    submittingPassword: "Signing in…",
    submitEmail: "Send code",
    sendingEmail: "Sending code…",
    signUp: { prompt: "New to BandUp?", link: "Create account" },
    invalidCredentials: {
        title: "Couldn’t sign in",
        description: "Email or password is incorrect",
    },
    generalError: {
        title: "Something went wrong",
        description:
            "We couldn’t reach BandUp. Check your connection and try again.",
    },
    session: {
        expiredTitle: "Your session has expired",
        expiredDescription:
            "Your answers on this device are kept. Sign in again to continue.",
        protectedTitle: "Please sign in to continue",
        resumeFallback:
            "We’ll return you to where you left off. Your answers are kept on this device.",
        resumeWithInfo: (title: string, detail?: string) =>
            `We’ll return you to your saved work: ${[title, detail]
                .filter(Boolean)
                .join(", ")}. Your answers are kept on this device.`,
    },
} as const;

export const LOGIN_VERIFY_COPY = {
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
    success: {
        title: "Email verified",
        subtitleResume: "You’re signed in. Your saved practice is ready.",
        subtitleDefault: "You’re signed in.",
        noticeTitle: "Verification successful",
        noticeResume: "Your saved work is ready to continue.",
        noticeDefault: "Your dashboard is ready.",
        redirectResume: "Taking you to your saved work…",
        redirectDefault: "Taking you to your dashboard…",
    },
} as const;
