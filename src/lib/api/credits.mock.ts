import type { CreditsResponse } from "@/types/credits";

export async function mockFetchCredits(): Promise<CreditsResponse> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return { writing: { remaining: 3, total: 3 } };
}