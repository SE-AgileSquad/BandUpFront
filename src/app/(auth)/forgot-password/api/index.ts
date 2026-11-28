import { env } from "@/config/env";
import type { ForgotApi } from "../types";
import { forgotApi as realApi } from "./forgot.api";
import { forgotApi as mockApi } from "./forgot.mock";

export const forgotApi: ForgotApi = env.useMockApi ? mockApi : realApi;