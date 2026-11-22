"use client";

import { usePassagesQuery } from "@/app/dashboard/reading/_shared/api/reading.queries";

export function usePassages() {
    const query = usePassagesQuery();

    return {
        passages: query.data ?? [],
        dataUpdatedAt: query.dataUpdatedAt,
        isPending: query.isPending,
        isError: query.isError,
        refetch: query.refetch,
    };
}