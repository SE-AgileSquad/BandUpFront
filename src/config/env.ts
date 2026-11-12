export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
  useMockApi: process.env.NEXT_PUBLIC_USE_MOCK_API === "true",
} as const;