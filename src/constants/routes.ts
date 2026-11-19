export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  REGISTER_VERIFY: "/register/verify",
  REGISTER_SUCCESS: "/register/success",
  LOGIN_VERIFY: "/login/verify",
  FORGOT_PASSWORD: "/forgot-password",
  DASHBOARD: "/dashboard",
  PRIVACY: "/privacy",
  TERMS: "/terms",
  CONTACT: "/contact",
} as const;

export const DASHBOARD_ROUTES = {
  HOME: "/dashboard",
  LESSONS: "/dashboard/lessons",
  READING: "/dashboard/reading",
  MISTAKES: "/dashboard/mistakes",
  PARAPHRASE: "/dashboard/paraphrase",
  WORD_CARDS: "/dashboard/word-cards",
  WRITING: "/dashboard/writing",
  ASSISTANT: "/dashboard/assistant",
  SEARCH: "/dashboard/search",
  HISTORY: "/dashboard/history",
} as const;
