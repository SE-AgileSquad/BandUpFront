import { env } from "@/config/env";
import { api } from "@/lib/axios";
import { mockSession } from "@/lib/mock-session";
import { ApiError } from "@/types/api";
import type { AuthUser } from "@/types/auth";

export const authKeys = { me: ["auth", "me"] as const };

export async function fetchMe(): Promise<AuthUser | null> {
    if (env.useMockApi) return mockSession.get();

    try {
        const { data } = await api.get<{ user: AuthUser }>("/auth/me");
        return data.user ?? null;
    } catch (error) {
        if (error instanceof ApiError && error.status === 401) return null;
        throw error;
    }
}