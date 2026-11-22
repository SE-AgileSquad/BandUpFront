import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { env } from "@/config/env";
import { ROUTES } from "@/constants/routes";
import { ApiError } from "@/types/api";

export const api = axios.create({
  baseURL: env.apiUrl,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "bandup",
  },
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL: env.apiUrl,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "bandup",
  },
  withCredentials: true,
});

type RetriableRequestConfig = InternalAxiosRequestConfig & { _authRetry?: boolean };

let refreshInFlight: Promise<void> | null = null;

function refreshSession() {
  if (!refreshInFlight) {
    refreshInFlight = refreshClient
      .post("/api/auth/refresh", {})
      .then(() => undefined)
      .finally(() => {
        refreshInFlight = null;
      });
  }

  return refreshInFlight;
}

function isAuthFlowRequest(url = "") {
  return /\/(?:api\/)?auth\/(login|register)(\/|$)/.test(url) || /\/(?:api\/)?auth\/(refresh|logout)(\/|$)/.test(url);
}

function redirectToLogin() {
  if (typeof window === "undefined") return;
  const { pathname, search } = window.location;
  if (
    pathname === ROUTES.LOGIN ||
    pathname.startsWith(`${ROUTES.LOGIN}/`) ||
    pathname === ROUTES.REGISTER ||
    pathname.startsWith(`${ROUTES.REGISTER}/`)
  ) {
    return;
  }

  const params = new URLSearchParams({
    next: `${pathname}${search}`,
    reason: "session-expired",
  });
  window.location.replace(`${ROUTES.LOGIN}?${params.toString()}`);
}

function isInvalidRefreshError(error: unknown) {
  if (!axios.isAxiosError(error)) return false;
  const status = error.response?.status;
  return status === 400 || status === 401 || status === 403;
}

function toApiError(error: AxiosError<{ message?: string; code?: string; detail?: string; title?: string }>) {
  const status = error.response?.status ?? 0;
  const message =
    error.response?.data?.detail ??
    error.response?.data?.message ??
    error.response?.data?.title ??
    error.message ??
    "Something went wrong";

  return new ApiError(message, status, error.response?.data?.code, error.response?.data);
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string; code?: string; detail?: string; title?: string }>) => {
    const config = error.config as RetriableRequestConfig | undefined;

    if (error.response?.status === 401 && config && !isAuthFlowRequest(config.url)) {
      if (config._authRetry) {
        redirectToLogin();
      } else {
        config._authRetry = true;
        try {
          await refreshSession();
          return await api.request(config);
        } catch (refreshError) {
          if (isInvalidRefreshError(refreshError)) redirectToLogin();
        }
      }
    }

    return Promise.reject(toApiError(error));
  },
);
