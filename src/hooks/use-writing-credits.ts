"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCredits } from "@/lib/api/credits.api";

export const creditsKeys = { writing: ["me", "credits"] as const };

export function useWritingCredits() {
    return useQuery({
        queryKey: creditsKeys.writing,
        queryFn: fetchCredits,
        select: (data) => data.writing,
        staleTime: 60 * 1000,
    });
}