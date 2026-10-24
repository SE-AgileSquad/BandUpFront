"use client";

import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api/auth.api";
import type {
    LoginPayload,
    LoginResponse,
    MappedAuthError,
} from "../types/auth.types";
import { mapAuthError } from "../utils/map-auth-error";

interface LoginHandlers {
    onSuccess: (response: LoginResponse) => void;
    onError: (error: MappedAuthError) => void;
}

export function useLogin() {
    const mutation = useMutation({ mutationFn: loginUser });

    const login = (payload: LoginPayload, handlers: LoginHandlers) =>
        mutation.mutate(payload, {
            onSuccess: handlers.onSuccess,
            onError: (error) => handlers.onError(mapAuthError(error, "login")),
        });

    return { login, isPending: mutation.isPending };
}