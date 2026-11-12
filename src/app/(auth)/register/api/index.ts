import { env } from "@/config/env";
import type { RegisterApi } from "../types";
import { registerApi as realApi } from "./register.api";
import { registerApi as mockApi } from "./register.mock";

export const registerApi: RegisterApi = env.useMockApi ? mockApi : realApi;