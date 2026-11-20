import type { LoginApi } from "../types";
import { loginApi as realApi } from "./login.api";
import { loginApi as mockApi } from "./login.mock";
import { env } from "@/config/env";

export const loginApi: LoginApi = {
    login: realApi.login,
    sendCode: env.useMockOtp ? mockApi.sendCode : realApi.sendCode,
    verifyCode: env.useMockOtp ? mockApi.verifyCode : realApi.verifyCode,
    resendCode: env.useMockOtp ? mockApi.resendCode : realApi.resendCode,
};
