import { api } from "@/lib/axios";
import type {
    LoginApi,
    LoginResponse,
    ResendCodeResponse,
    SendCodeResponse,
    VerifyCodeResponse,
} from "../types";

export const loginApi: LoginApi = {
    async login(payload) {
        const { data } = await api.post<LoginResponse>("/api/auth/login", payload);
        return data;
    },
    async sendCode(payload) {
        const { data } = await api.post<SendCodeResponse>("/api/auth/login/email/send", payload);
        return data;
    },
    async verifyCode(payload) {
        const { data } = await api.post<VerifyCodeResponse>("/api/auth/login/email/verify", payload);
        return data;
    },
    async resendCode(payload) {
        const { data } = await api.post<ResendCodeResponse>("/api/auth/login/email/resend", payload);
        return data;
    },
};
