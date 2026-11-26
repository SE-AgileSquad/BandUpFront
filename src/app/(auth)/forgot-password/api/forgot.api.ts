import { api } from "@/lib/axios";
import type {
    ForgotApi,
    ResendCodeResponse,
    SendCodeResponse,
} from "../types";

export const forgotApi: ForgotApi = {
    async sendCode(payload) {
        const { data } = await api.post<SendCodeResponse>("/api/auth/password/forgot", payload);
        return data;
    },
    async resendCode(payload) {
        const { data } = await api.post<ResendCodeResponse>(
            "/api/auth/password/forgot/resend",
            payload,
        );
        return data;
    },
    async reset(payload) {
        await api.post("/api/auth/password/reset", payload);
    },
};