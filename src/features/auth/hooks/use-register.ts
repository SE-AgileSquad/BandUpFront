"use client";

import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../api/auth.api";
import type {
  MappedAuthError,
  RegisterPayload,
  RegisterResponse,
} from "../types/auth.types";
import { mapAuthError } from "../utils/map-auth-error";

interface RegisterHandlers {
  onSuccess: (response: RegisterResponse) => void;
  onError: (error: MappedAuthError) => void;
}

export function useRegister() {
  const mutation = useMutation({ mutationFn: registerUser });

  const register = (payload: RegisterPayload, handlers: RegisterHandlers) =>
    mutation.mutate(payload, {
      onSuccess: handlers.onSuccess,
      onError: (error) => handlers.onError(mapAuthError(error, "register")),
    });

  return { register, isPending: mutation.isPending };
}