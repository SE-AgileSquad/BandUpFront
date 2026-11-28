import { api } from "@/lib/axios";
import type {
    RegisterApi,
    RegisterResponse,
    ResendResponse,
    StartOtpPayload,
    VerifyResponse,
} from "../types";
import type { AuthUser } from "@/types/auth";

export const registerApi: RegisterApi = {
    async register(payload) {
        const { data } = await api.post<AuthUser>("/api/auth/register", payload);
        return data;
    },
    async sendCode(payload: StartOtpPayload) {
        const { data } = await api.post<RegisterResponse>("/api/auth/register/email/send", payload);
        return data;
    },
    async verify(payload) {
        const { data } = await api.post<VerifyResponse>("/auth/register/verify", payload);
        return data;
    },
    async resend(payload) {
        const { data } = await api.post<ResendResponse>("/auth/register/resend", payload);
        return data;
    },
};
