"use client";

import { useQuery } from "@tanstack/react-query";
import { authKeys, fetchMe } from "@/lib/auth-api";
import type { AuthUser } from "@/types/auth";

export function useAuth(): {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
} {
  const { data, isPending } = useQuery({
    queryKey: authKeys.me,
    queryFn: fetchMe,
    retry: false,
    staleTime: 60 * 1000,
  });

  return {
    isAuthenticated: Boolean(data),
    isLoading: isPending,
    user: data ?? null,
  };
}