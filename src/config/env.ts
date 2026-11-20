export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
  useMockOtp: process.env.NEXT_PUBLIC_MOCK_OTP === "true",
  turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "",
  useMockApi: process.env.NEXT_PUBLIC_USE_MOCK_API === "true",
} as const;
