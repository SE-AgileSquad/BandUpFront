export const REGISTER_METADATA = {
    register: "Create your account · BandUp",
    verify: "Verify your phone · BandUp",
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

export const MOCK_TAKEN_PHONE = "+989120000000";
export const MOCK_VALID_CODE = "12345";
export const MOCK_EXPIRED_CODE = "00000";

export const REGISTER_COPY = {
    title: "Create your account",
    subtitle: "Start with 3 free Writing checks and your first Reading passage.",
    fields: {
        fullName: { label: "Full name", placeholder: "Your name" },
        phone: { label: "Phone number", placeholder: "+98 912 000 0000" },
        password: {
            label: "Password",
            placeholder: "At least 8 characters",
            helper: "Use 8+ characters with a mix of letters and numbers.",
        },
    },
    errors: {
        fullName: "Enter your first and last name.",
        phone: "Enter a valid phone number.",
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
    phoneTaken: {
        title: "Phone already registered",
        description:
            "An account already uses this phone number. Sign in or reset your password.",
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
    subtitle: "Your phone is verified. Your first 3 Writing checks are on us.",
    imageSrc: "/images/auth/img_mascot_celebrating.png",
    imageAlt: "BandUp mascot celebrating",
    notice: {
        title: "Welcome to BandUp",
        description: "",
    },
    redirecting: "Taking you to your dashboard…",
} as const;