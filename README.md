# BandUp

BandUp project by Erfan Ghasemian Amiri and Ali Gholamzade.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For the frontend folder map, development conventions, and `.env.local` setup, see [FRONTEND_README.md](FRONTEND_README.md).

## Authentication (current implementation)

This section describes the frontend as it is currently implemented. The backend contract may change; update this document when it does.

### Session and cookies

The shared Axios client is defined in `src/lib/axios.ts`. It uses `NEXT_PUBLIC_API_URL` as its base URL and sets `withCredentials: true`, so the browser includes credentials such as cookies on API requests. The frontend does not read, store, or attach an access token itself. Login and verification responses are used to update the frontend's cached user; the backend is responsible for establishing and clearing the cookie session.

The frontend expects the browser to accept the backend's cookie. For cross-origin API deployments, the backend and hosting configuration must allow credentialed requests and set compatible cookie and CORS attributes.

### Backend endpoints

The real API calls currently use these paths (relative to `NEXT_PUBLIC_API_URL`):

| Action | Method | Path |
| --- | --- | --- |
| Read current user | `GET` | `/api/auth/me` |
| Password login | `POST` | `/api/auth/login` |
| Send login email code | `POST` | `/api/auth/login/email/send` |
| Verify login email code | `POST` | `/api/auth/login/email/verify` |
| Resend login email code | `POST` | `/api/auth/login/email/resend` |
| Create account | `POST` | `/api/auth/register` |
| Send registration email code | `POST` | `/api/auth/register/email/send` |
| Verify registration email code | `POST` | `/auth/register/verify` |
| Resend registration email code | `POST` | `/auth/register/resend` |
| Log out | `POST` | `/auth/logout` |

The registration verification and logout paths currently omit the `/api` prefix used by several other auth paths. This table records the paths in the code; confirm them against the backend if its routes change.

The Axios response interceptor converts failed responses into `ApiError`, using response `detail`, `message`, or `title` as its message when available, and carries the status, code, and response data.

### Current user and hooks

`AuthUser` is defined in `src/types/auth.ts` with these fields:

```ts
type AuthUser = {
  id: string;
  email: string;
  displayName: string;
  role: string;
  creditBalance: number;
};
```

`src/lib/auth-api.ts` owns the React Query key `authKeys.me` (`["auth", "me"]`) and `fetchMe()`, which requests `GET /api/auth/me`. A `401` is treated as a signed-out user (`null`); other errors are allowed to surface.

`useAuth()` in `src/hooks/use-auth.ts` exposes:

- `user`: the cached `AuthUser`, or `null` while signed out / before data is available.
- `isAuthenticated`: `true` when a user object is present.
- `isLoading`: `true` while the initial current-user query is pending.

The current-user query has retries disabled and a one-minute stale time. Its data lives in the React Query cache; the authentication user is not independently persisted in local storage.

Successful password login and email-code verification write the returned user to `authKeys.me`. Registration success writes the user saved in the registration flow to the same cache. `refreshAuth(queryClient)` is available to invalidate and refetch that query.

### Login flows

**Password login** uses `useLoginMutation()` and posts email, password, and captcha token to `/api/auth/login`. On success, the returned user is cached, the login flow state is reset, and the app navigates to the `next` destination or `/dashboard`.

**Email-code login** sends a code using `useSendLoginCodeMutation()`, then stores the verification challenge in a Zustand flow persisted for the browser session (`sessionStorage`). `useVerifyLoginCodeMutation()` verifies the code. On success, the returned `user` is cached, the flow is reset, and the app navigates to `next` or `/dashboard`. Resend and timer/lockout state are also handled by the OTP flow.

The `next` query parameter is sanitized by `src/lib/safe-redirect.tsx`: it must be a local absolute path, and login/register paths are blocked as destinations.

### Registration flow

Registration first posts account details to `/api/auth/register`, then requests an email code from `/api/auth/register/email/send`. The registration flow stores the returned user and OTP challenge in session storage. Verification marks the flow complete and opens the success page. That page places the stored user in `authKeys.me`, clears the registration flow, and redirects to `/dashboard`.

The current registration success page uses the user saved during account creation. Although the verification API is typed as returning `{ user: AuthUser }`, the current verification component does not use that response to update the auth cache.

### Route protection and logout

- `GuestOnly` redirects an already authenticated visitor away from login/register pages to the sanitized `next` path or `/dashboard`.
- `RequireAuth`, used by the dashboard layout, waits for `useAuth()`. A signed-out visitor is sent to `/login` with the current path and query string as `next`.
- `useLogout()` calls `POST /auth/logout`. On success, it clears the React Query cache and redirects to `/login`.

### Mock behavior

`NEXT_PUBLIC_USE_MOCK_API=true` selects the mock logout implementation. `NEXT_PUBLIC_MOCK_OTP=true` selects mock send/verify/resend functions for login and registration email-code flows. Password login, account creation, and the current-user query still use their real API implementations; mock OTP mode does not switch the whole auth system to mocks.

Related environment variables are defined in `src/config/env.ts`:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_USE_MOCK_API`
- `NEXT_PUBLIC_MOCK_OTP`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
