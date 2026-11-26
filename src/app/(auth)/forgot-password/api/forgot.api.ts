import { api } from "@/lib/axios";
import type {
    ForgotApi,
    ResendCodeResponse,
    SendCodeResponse,
} from "../types";

export const forgotApi: ForgotApi = {
    async sendCode(payload) {
        const { data } = await api.post<SendCodeResponse>("/api/auth/forgot-password", payload);
        return data ?? {};
    },
    async resendCode(payload) {
        const { data } = await api.post<ResendCodeResponse>(
            "/api/auth/forgot-password",
            payload,
        );
        return data ?? {};
    },
    async reset(payload) {
        await api.post("/api/auth/reset-password", payload);
    },
};
