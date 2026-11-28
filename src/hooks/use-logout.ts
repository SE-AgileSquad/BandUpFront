"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ROUTES } from "@/constants/routes";
import { logout } from "@/lib/api/auth.api";
import { markManualLogout, resetManualLogout } from "@/lib/axios";

export function useLogout() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logout,
        onMutate: () => {
            markManualLogout();
        },
        onSuccess: () => {
            queryClient.clear();
            router.replace(ROUTES.LOGIN);
        },
        onError: () => {
            resetManualLogout();
        },
    });
}
