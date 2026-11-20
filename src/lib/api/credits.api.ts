import { env } from "@/config/env";
import { api } from "@/lib/axios";
import type { CreditsResponse } from "@/types/credits";
import { mockFetchCredits } from "./credits.mock";

async function realFetchCredits(): Promise<CreditsResponse> {
    const { data } = await api.get<CreditsResponse>("/me/credits");
    return data;
}

export const fetchCredits = env.useMockApi ? mockFetchCredits : realFetchCredits;