export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

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

// Auth endpoints where a 401 means "wrong credentials / invalid session",
// not "access token expired", so we must not refresh or redirect.
const NO_REFRESH_PATHS = [
  "/api/v1/auth/login",
  "/api/v1/auth/register",
  "/api/v1/auth/refresh",
];

function redirectToLogin(): void {
  const { pathname, search } = window.location;
  if (pathname !== "/login" && pathname !== "/login/") {
    // Keep the current page so the user returns here after signing in.
    const next = encodeURIComponent(pathname + search);
    window.location.href = `/login?next=${next}`;
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
  const hasBody = options.body !== undefined && options.body !== null;
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include", // browser attaches/stores the JWT cookies
    headers: {
      ...(hasBody && !isFormData ? { "Content-Type": "application/json" } : {}),
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
      try {
        // The refresh token travels in its own HttpOnly cookie, so no body.
        // The server answers with new Set-Cookie headers.
        const { res, json } = await rawRequest<unknown>(
          "/api/v1/auth/refresh",
          { method: "POST" }
        );
        return res.ok && json?.success !== false;
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
 * Auth is handled entirely by HttpOnly cookies (credentials: "include").
 * On 401, tries a single silent refresh + retry; if that also fails,
 * redirects to /login.
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  _isRetry = false
): Promise<T> {
  const { res, json } = await rawRequest<T>(path, options);

  if (res.status === 401 && !NO_REFRESH_PATHS.includes(path)) {
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