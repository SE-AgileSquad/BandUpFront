import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from "./token-storage";

export const API_BASE_URL = "localhost:8000";

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function redirectToLogin(): void {
  clearTokens();
  localStorage.setItem("isLoggedIn", "false");

  const pathname = window.location.pathname;
  if (pathname !== "/login" && pathname !== "/login/") {
    window.location.href = "/login";
  }
}

interface RawResult<T> {
  res: Response;
  json: ApiEnvelope<T> | null;
}

async function rawRequest<T>(
  path: string,
  options: RequestInit
): Promise<RawResult<T>> {
  const accessToken = getAccessToken();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(options.headers || {}),
    },
  });

  let json: ApiEnvelope<T> | null = null;
  try {
    json = (await res.json()) as ApiEnvelope<T>;
  } catch {
    // Some endpoints may return an empty body.
  }

  return { res, json };
}

// De-dupe concurrent refresh attempts if multiple requests 401 at once.
let refreshPromise: Promise<boolean> | null = null;

export function attemptRefresh(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = getRefreshToken();
      if (!refreshToken) return false;

      try {
        const { res, json } = await rawRequest<{
          accessToken: string;
          refreshToken: string;
        }>("/api/v1/auth/refresh", {
          method: "POST",
          body: JSON.stringify({ refreshToken }),
        });

        if (!res.ok || !json?.success || !json.data?.accessToken) {
          return false;
        }

        saveTokens(json.data.accessToken, json.data.refreshToken);
        return true;
      } catch {
        return false;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}
/**
 * Wraps fetch() for the backend's {success, message, data} envelope.
 * Attaches the access token as a Bearer header. On 401, tries a single
 * silent refresh + retry; if that also fails, clears tokens and redirects
 * to /login.
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  _isRetry = false
): Promise<T> {
  const { res, json } = await rawRequest<T>(path, options);

  if (res.status === 401) {
    if (!_isRetry) {
      const refreshed = await attemptRefresh();
      if (refreshed) {
        return apiFetch<T>(path, options, true);
      }
    }
    redirectToLogin();
    throw new ApiError("Unauthorized", 401);
  }

  if (!res.ok || !json || json.success === false) {
    const message = json?.message || `Request failed (${res.status})`;
    throw new ApiError(message, res.status);
  }

  return json.data;
}