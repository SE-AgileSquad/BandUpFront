// @ts-nocheck

import { ApiError } from "@/lib/api-client";
import {
  DEFAULT_RATE_LIMIT_SECONDS,
  SECONDS_PER_MINUTE,
} from "../constants/auth.constants";
import type {
  AuthErrorContext,
  AuthErrorField,
  MappedAuthError,
} from "../types/auth.types";

type ErrorMapper = (error: ApiError) => MappedAuthError | null;

const FIELD_NAMES: readonly AuthErrorField[] = [
  "displayName",
  "email",
  "password",
  "captchaToken",
];

const NETWORK_MESSAGES: Record<AuthErrorContext, string> = {
  register: "We couldn't reach the server. Your details are kept — try again.",
  login: "We couldn't reach the server. Try again.",
  verify: "We couldn't reach the server. Try again.",
  resend: "We couldn't reach the server. Try again.",
};

const UNKNOWN_MESSAGE = "Something went wrong. Please try again.";

function rateLimitMessage(
  context: AuthErrorContext,
  retryAfterSeconds?: number,
): string {
  if (context === "resend") {
    const minutes = Math.max(
      1,
      Math.ceil(
        (retryAfterSeconds ?? DEFAULT_RATE_LIMIT_SECONDS) / SECONDS_PER_MINUTE,
      ),
    );
    return `Too many requests. Try again in ${minutes} ${minutes === 1 ? "minute" : "minutes"}.`;
  }

  return context === "verify"
    ? "Too many attempts. Please wait a few minutes and try again."
    : "Too many attempts. Please try again in a few minutes.";
}

function pickFieldErrors(
  raw: Record<string, string> | undefined,
): Partial<Record<AuthErrorField, string>> {
  const picked: Partial<Record<AuthErrorField, string>> = {};

  for (const name of FIELD_NAMES) {
    const message = raw?.[name];
    if (message) {
      picked[name] = message;
    }
  }

  return picked;
}

function mapCaptchaError(error: ApiError): MappedAuthError | null {
  if (error.status === 422 && error.code === "CAPTCHA_FAILED") {
    return {
      kind: "captcha",
      message: "We couldn't verify you. Please try again.",
    };
  }

  if (error.status === 503 && error.code === "CAPTCHA_UNAVAILABLE") {
    return {
      kind: "captcha",
      message:
        "Verification is temporarily unavailable. Please try again in a few minutes.",
    };
  }

  return null;
}

const mapRegisterError: ErrorMapper = (error) => {
  if (error.status === 409 && error.code === "EMAIL_EXISTS") {
    return {
      kind: "email-exists",
      field: "email",
      message: "An account with this email already exists. Sign in instead?",
    };
  }

  if (error.status === 400) {
    const fieldErrors = pickFieldErrors(error.fieldErrors);
    const [first] = Object.values(fieldErrors);
    if (first) {
      return { kind: "field", message: first, fieldErrors };
    }
  }

  return mapCaptchaError(error);
};

const mapLoginError: ErrorMapper = (error) => {
  if (error.status === 401 && error.code === "INVALID_CREDENTIALS") {
    return {
      kind: "invalid-credentials",
      message: "Incorrect email or password.",
    };
  }

  if (error.status === 403 && error.code === "EMAIL_NOT_VERIFIED") {
    return {
      kind: "email-not-verified",
      message: "Please verify your email to sign in.",
    };
  }

  return mapCaptchaError(error);
};

const mapVerifyError: ErrorMapper = (error) => {
  if (error.status === 400 && error.code === "CODE_INVALID") {
    return { kind: "code-invalid", message: "That code is incorrect. Try again." };
  }

  if (error.status === 410 && error.code === "CODE_EXPIRED") {
    return {
      kind: "code-expired",
      message: "This code has expired. Request a new one.",
    };
  }

  return null;
};

const MAPPERS: Record<AuthErrorContext, ErrorMapper> = {
  register: mapRegisterError,
  login: mapLoginError,
  verify: mapVerifyError,
  resend: () => null,
};

export function mapAuthError(
  error: unknown,
  context: AuthErrorContext,
): MappedAuthError {
  if (!(error instanceof ApiError)) {
    return { kind: "network", message: NETWORK_MESSAGES[context] };
  }

  if (error.status === 429) {
    return {
      kind: "rate-limit",
      message: rateLimitMessage(context, error.retryAfterSeconds),
      retryAfterSeconds: error.retryAfterSeconds,
    };
  }

  const specific = MAPPERS[context](error);
  if (specific) {
    return specific;
  }

  if (error.status >= 500) {
    return { kind: "network", message: NETWORK_MESSAGES[context] };
  }

  const reference = error.referenceId ? ` (Ref: ${error.referenceId})` : "";
  return { kind: "unknown", message: `${UNKNOWN_MESSAGE}${reference}` };
}