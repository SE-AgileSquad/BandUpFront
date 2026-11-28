import { api } from "@/lib/axios";
import { ApiError } from "@/types/api";
import type { AuthUser } from "@/types/auth";
import type { QueryClient } from "@tanstack/react-query";

export const authKeys = { me: ["auth", "me"] as const };

export async function fetchMe(): Promise<AuthUser | null> {
    try {
        const { data } = await api.get<AuthUser>("/api/auth/me");
        return data ?? null;
    } catch (error) {
        if (error instanceof ApiError && error.status === 401) return null;
        throw error;
    }
}

export function refreshAuth(queryClient: QueryClient) {
  return queryClient.invalidateQueries({
    queryKey: authKeys.me,
    refetchType: "all",
  });
}
