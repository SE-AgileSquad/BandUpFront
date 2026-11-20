export const REGISTER_METADATA = {
    register: "Create your account · BandUp",
    verify: "Verify your email · BandUp",
    success: "You’re all set · BandUp",
} as const;

export const REGISTER_LIMITS = {
    codeLength: 5,
    passwordMin: 8,
    resendCooldownMs: 60_000,
    codeTtlMs: 5 * 60_000,
    lockMs: 15 * 60_000,
    maxWrongAttempts: 3,
} as const;

export const MOCK_TAKEN_EMAIL = "taken@bandup.test";
export const MOCK_VALID_CODE = "12345";
export const MOCK_EXPIRED_CODE = "00000";

export const REGISTER_COPY = {
    title: "Create your account",
    subtitle: "Start with 3 free Writing checks and your first Reading passage.",
    fields: {
        displayName: { label: "Display name", placeholder: "Your name" },
        email: { label: "Email", placeholder: "you@example.com" },
        password: {
            label: "Password",
            placeholder: "At least 8 characters",
            helper: "Use 8+ characters with a mix of letters and numbers.",
        },
    },
    errors: {
        displayName: "Enter your display name.",
        email: "Enter a valid email.",
        passwordLength: "Use at least 8 characters.",
        passwordMix: "Include both letters and numbers.",
        captcha: "Complete the CAPTCHA to continue.",
        terms: "Accept the terms to create your account.",
    },
    terms: {
        prefix: "I agree to the ",
        termsLabel: "Terms of Service",
        joiner: " and ",
        privacyLabel: "Privacy Policy",
        suffix: ".",
    },
    submit: "Create account →",
    submitting: "Creating account…",
    login: { prompt: "Already have an account?", link: "Log in" },
    emailTaken: {
        title: "Email already registered",
        description:
            "An account already uses this email. Sign in or reset your password.",
        signIn: "Sign in instead",
        reset: "Reset password",
    },
    generalError: {
        title: "Something went wrong",
        description:
            "We couldn’t create your account. Check your connection and try again.",
    },
} as const;

export const VERIFY_COPY = {
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
} as const;

export const SUCCESS_COPY = {
    title: "You’re all set!",
    subtitle: "Your email is verified. Your first 3 Writing checks are on us.",
    imageSrc: "/images/auth/img_mascot_celebrating.png",
    imageAlt: "BandUp mascot celebrating",
    notice: {
        title: "Welcome to BandUp",
        description: "",
    },
    redirecting: "Taking you to your dashboard…",
} as const;
