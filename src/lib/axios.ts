import axios, { type AxiosError } from "axios";
import { env } from "@/config/env";
import { ApiError } from "@/types/api";

export const api = axios.create({
  baseURL: env.apiUrl,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; code?: string }>) => {
    const status = error.response?.status ?? 0;
    const message =
      error.response?.data?.message ?? error.message ?? "Something went wrong";

    return Promise.reject(
      new ApiError(message, status, error.response?.data?.code, error.response?.data),
    );
  },
);