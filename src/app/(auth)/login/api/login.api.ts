import { api } from "@/lib/axios";
import type {
    LoginApi,
    LoginResponse,
    ResendCodeResponse,
    SendCodeResponse,
    VerifyCodeResponse,
} from "../types";
import { LOGIN_LIMITS } from "../constants/login";
import { maskEmail } from "@/lib/email";

function challengeTimes() {
    const now = Date.now();
    return {
        expiresAt: new Date(now + LOGIN_LIMITS.codeTtlMs).toISOString(),
        resendAvailableAt: new Date(now + LOGIN_LIMITS.resendCooldownMs).toISOString(),
    };
}

export const loginApi: LoginApi = {
    async login(payload) {
        const { data } = await api.post<LoginResponse>("/api/auth/login", payload);
        return data;
    },
    async sendCode(payload) {
        await api.post("/api/auth/otp/request", payload);
        return {
            verificationId: payload.email,
            maskedEmail: maskEmail(payload.email),
            codeLength: LOGIN_LIMITS.codeLength,
            ...challengeTimes(),
        } satisfies SendCodeResponse;
    },
    async verifyCode(payload) {
        const { data } = await api.post<VerifyCodeResponse>("/api/auth/otp/verify", payload);
        return data;
    },
    async resendCode(payload) {
        await api.post("/api/auth/otp/request", payload);
        return challengeTimes();
    },
};
