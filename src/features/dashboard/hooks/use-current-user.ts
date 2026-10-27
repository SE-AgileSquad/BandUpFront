"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LOGIN_PATH } from "@/features/auth/constants/auth.constants";
import { ApiError } from "@/lib/api-client";
import { getCurrentUser } from "../api/current-user.api";
import { CURRENT_USER_QUERY_KEY } from "../constants/dashboard.constants";

interface UseCurrentUserOptions {
    requireUser?: boolean;
}

const UNAUTHORIZED_STATUS = 401;

export function useCurrentUser({ requireUser = false }: UseCurrentUserOptions = {}) {
    const router = useRouter();
    const query = useQuery({
        queryKey: CURRENT_USER_QUERY_KEY,
        queryFn: getCurrentUser,
        staleTime: Infinity,
    });

    const isMissingUser = query.isSuccess && !query.data?.user;
    const isUnauthorized =
        query.error instanceof ApiError && query.error.status === UNAUTHORIZED_STATUS;

    useEffect(() => {
        if (requireUser && (isMissingUser || isUnauthorized)) {
            router.replace(LOGIN_PATH);
        }
    }, [requireUser, isMissingUser, isUnauthorized, router]);

    return {
        data: query.data,
        user: query.data?.user,
        state: query.data?.state,
        isLoading: query.isLoading,
        isError: query.isError,
        refetch: query.refetch,
    };
}