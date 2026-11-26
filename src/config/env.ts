export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
  useMockOtp: process.env.NEXT_PUBLIC_MOCK_OTP === "true",
  turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "",
  useLocalCaptcha:
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_LOCAL_FAKE_CAPTCHA === "true",
  useMockApi: process.env.NEXT_PUBLIC_USE_MOCK_API === "true",
} as const;
