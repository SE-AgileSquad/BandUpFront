"use client";

import { useQuery } from "@tanstack/react-query";
import { authKeys, fetchMe } from "@/lib/auth-api";

export function useWritingCredits() {
    return useQuery({
        queryKey: authKeys.me,
        queryFn: fetchMe,
        select: (user) => user?.creditBalance ?? null,
        staleTime: 60 * 1000,
    });
}
