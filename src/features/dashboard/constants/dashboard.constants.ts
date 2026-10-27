import type { DashboardUserState } from "../types/dashboard.types";

export const MOCK_STATE_STORAGE_KEY = "bandup.mock-user-state";
export const MOCK_LATENCY_MS = 300;
export const DEFAULT_MOCK_STATE: DashboardUserState = "returning";
export const CURRENT_USER_QUERY_KEY = ["current-user"] as const;
export const SEARCH_QUERY_MAX_LENGTH = 300;

export const DASHBOARD_HOME_PATH = "/dashboard/user";
export const READING_TEST_PATH = "/dashboard/user/reading-test";
export const SEARCH_PATH = "/dashboard/user/search";
export const SIGN_OUT_ENDPOINT = "/api/v1/auth/logout";

export const MAIN_CONTENT_ID = "main-content";
export const PAGE_TITLE_FALLBACK = "Dashboard";