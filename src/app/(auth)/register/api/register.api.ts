import { api } from "@/lib/axios";
import type {
    RegisterApi,
    RegisterResponse,
    ResendResponse,
    VerifyResponse,
} from "../types";

export const registerApi: RegisterApi = {
    async register(payload) {
        const { data } = await api.post<RegisterResponse>("/auth/register", payload);
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