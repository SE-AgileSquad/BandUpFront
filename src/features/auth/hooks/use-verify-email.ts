"use client";

import { useMutation } from "@tanstack/react-query";
import { verifyEmail } from "../api/auth.api";
import type {
  MappedAuthError,
  VerifyEmailPayload,
  VerifyEmailResponse,
} from "../types/auth.types";
import { mapAuthError } from "../utils/map-auth-error";

interface VerifyHandlers {
  onSuccess: (response: VerifyEmailResponse) => void;
  onError: (error: MappedAuthError) => void;
}

export function useVerifyEmail() {
  const mutation = useMutation({ mutationFn: verifyEmail });

  const verify = (payload: VerifyEmailPayload, handlers: VerifyHandlers) =>
    mutation.mutate(payload, {
      onSuccess: handlers.onSuccess,
      onError: (error) => handlers.onError(mapAuthError(error, "verify")),
    });

  return { verify, isPending: mutation.isPending };
}