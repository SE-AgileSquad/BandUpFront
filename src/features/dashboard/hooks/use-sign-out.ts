"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { LOGIN_PATH } from "@/features/auth/constants/auth.constants";
import { apiFetch } from "@/lib/api-client";
import { SIGN_OUT_ENDPOINT } from "../constants/dashboard.constants";

export function useSignOut() {
    const queryClient = useQueryClient();
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: () => apiFetch<unknown>(SIGN_OUT_ENDPOINT, { method: "POST" }),
        onSettled: () => {
            queryClient.clear();
            router.replace(LOGIN_PATH);
        },
    });

    return { signOut: () => mutation.mutate(), isPending: mutation.isPending };
}