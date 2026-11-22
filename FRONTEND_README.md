# BandUp Frontend Guide

This guide is for people joining the frontend project. It describes the current code and conventions; backend contracts and unfinished product areas may change as development continues.

## Get started

You need Node.js/npm and access to the project environment settings. From the repository root:

```bash
npm install
```

Create `.env.local` as described below, then run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The project uses Next.js App Router, React, TypeScript, Tailwind CSS 4, and the `@/*` alias for imports from `src/`.

Other scripts in `package.json` are `npm run build`, `npm start`, and `npm run lint`.

## Environment setup

Next.js reads `.env.local` from the repository root. It is ignored by Git (`.gitignore` ignores `.env*`), so each developer needs their own local copy. Ask the project owner for the appropriate values; do not commit or share the file. It is safe to commit variable names and placeholders, but never real credentials.

Example shape:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_MOCK_OTP=false
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
```

Replace the API URL and site key with values for your environment. The URL above is only an example. If the backend is unavailable, the mock switches described below can help with supported flows. Restart the Next.js dev server after changing environment values.

All four settings are read in `src/config/env.ts`:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL for the Axios API clients. An empty value means requests use the frontend's origin. |
| `NEXT_PUBLIC_USE_MOCK_API` | Set to the exact string `true` to use mocks for selected features that consult this switch, currently reading, credits, and logout. |
| `NEXT_PUBLIC_MOCK_OTP` | Set to the exact string `true` to mock sending, verifying, and resending email codes in login and registration. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Public Cloudflare Turnstile site key used by the captcha UI. Leave empty if not configured. |

`NEXT_PUBLIC_` values are included in browser-side code. Treat them as public configuration: never put passwords, private API keys, or other secrets in them. `NEXT_PUBLIC_USE_MOCK_API` is not a global switch for every endpoint: password login, registration creation, and fetching the current user still call the real API. Check a feature's API selector before assuming it has a mock.

## Project structure

```text
src/
  app/                 Routes, layouts, and page-specific modules (Next.js App Router)
    (marketing)/       Public landing page and its sections
    (auth)/            Login and registration routes and flows
    dashboard/         Authenticated product area and feature routes
  components/
    ui/                Reusable low-level UI primitives
    layout/            Public site shell, header, footer, and navigation
    auth/              Shared authentication UI and route guards
    dashboard/         Dashboard shell, navigation, and shared UI
    shared/            Small components shared across feature areas
  config/              Parsed application configuration, including env.ts
  constants/           Shared route, navigation, auth, and site constants
  hooks/               Cross-feature React hooks
  lib/                 API clients, utilities, auth helpers, and query client
    api/               Shared API implementations and corresponding mocks
  providers/           App-wide client providers
  types/               Shared TypeScript types
public/                Images, fonts, and other static assets
```

Feature-specific components, hooks, API clients, schemas, constants, and types generally live beside their route under `src/app/...`. For example, login code is under `src/app/(auth)/login/`; the reading feature keeps its list, test, and result views under `src/app/dashboard/reading/`. Parenthesized folders are Next.js route groups: they organize layouts without adding the group name to the URL. Dynamic segments such as `[passageId]` become URL parameters.

## How the app is put together

- `src/app/layout.tsx` is the root layout. It loads the global stylesheet and wraps routes in the shared providers.
- `src/providers/providers.tsx` installs the React Query client and theme provider. The query client is configured in `src/lib/query-client.ts`.
- The marketing route group uses `MainLayout` for the public header/footer. Auth pages have their own route-group layout. Dashboard pages use `DashboardShell` and `RequireAuth` in the dashboard layout.
- Shared URL definitions are in `src/constants/routes.ts`; navigation data lives in `src/constants/`.
- Styling is primarily Tailwind utility classes and shared theme variables in `src/app/globals.css`. Reusable primitives are in `src/components/ui/`.

## Current implementation map

The landing page is assembled from sections in `src/app/(marketing)/components/`. Login and registration include password/email-code flows, validation schemas, OTP screens, and flow-specific API modules. The authenticated dashboard has routes for lessons, reading, mistakes, paraphrase, word cards, writing, assistant, search, and history. The reading area is the most fully separated feature: it has passage-list, attempt/test, submission, and result routes, with shared types, API interfaces, hooks, and mock data within that feature.

This is a snapshot of the code organization, not a promise that every dashboard page is fully connected to production backend data. When picking up a feature, check its page, API selector, and mock before extending it; implementations differ by feature.

## Data and API flow

The shared Axios client is `src/lib/axios.ts`. It uses `NEXT_PUBLIC_API_URL`, sends cookies with `withCredentials`, converts failures to the shared `ApiError`, and attempts a session refresh after an eligible `401` before redirecting to login. Authentication state is exposed through `useAuth()` and cached with React Query under the `auth/me` key; OTP flow state is persisted in `sessionStorage`.

For feature data, the usual flow is:

1. Define request/response types near the feature (or in `src/types/` if shared).
2. Implement the API contract in a feature API module, using the shared `api` client where appropriate.
3. Put React Query hooks and query keys in a `*.queries.ts` module.
4. Have route pages compose feature components, leaving reusable UI in `src/components/` and feature-specific UI close to the route.

Some features provide an interface with real and mock implementations and choose between them in an `index.ts` selector. Keep mock responses aligned with the types so the UI can be developed without a live service. Reading drafts and related local recovery behavior are under `src/app/dashboard/reading/_shared/`.

## Working with a teammate

- Pull the latest changes and install dependencies with `npm install`; commit `package-lock.json` changes when dependencies intentionally change.
- Keep page-specific code in its feature folder. Promote a component or type to a shared folder when it has more than one genuine consumer.
- Reuse route constants, query keys, API types, and UI primitives instead of duplicating them.
- Keep credentials in local environment files or approved secret storage. Never add `.env.local` to a commit.
- When changing a backend integration, update its types, real API implementation, mock implementation (if present), and relevant documentation together.
- The existing [README](README.md) documents the current authentication API behavior and endpoint paths; check it alongside the code when changing auth integration.
