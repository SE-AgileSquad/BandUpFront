import { env } from "@/config/env";
import type { LoginApi } from "../types";
import { loginApi as realApi } from "./login.api";
import { loginApi as mockApi } from "./login.mock";

export const loginApi: LoginApi = env.useMockApi ? mockApi : realApi;