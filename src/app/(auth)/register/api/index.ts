import type { RegisterApi } from "../types";
import { registerApi as realApi } from "./register.api";
import { registerApi as mockApi } from "./register.mock";
import { env } from "@/config/env";

export const registerApi: RegisterApi = {
    register: realApi.register,
    sendCode: env.useMockOtp ? mockApi.sendCode : realApi.sendCode,
    verify: env.useMockOtp ? mockApi.verify : realApi.verify,
    resend: env.useMockOtp ? mockApi.resend : realApi.resend,
};
