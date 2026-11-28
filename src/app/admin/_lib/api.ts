import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { authKeys } from "@/lib/auth-api";
import { ApiError } from "@/types/api";

type Params = Record<string, string | number | boolean | undefined>;

export function adminQueryKey(path: string, params?: Params) {
  return ["admin", path, params] as const;
}

export function useAdminQuery<T>(path: string, params?: Params, enabled = true) {
  return useQuery({
    queryKey: adminQueryKey(path, params),
    queryFn: async ({ signal }) => (await api.get<T>(`/api/admin/${path}`, { params, signal })).data,
    enabled,
    retry: false,
  });
}

export async function writeAdmin<T = void>(method: "post" | "put" | "patch" | "delete", path: string, data: object = {}) {
  return (await api.request<T>({ method, url: `/api/admin/${path}`, data })).data;
}

export function useAdminAction<T, Input>(
  action: (input: Input) => Promise<T>,
  resources: string[],
  success?: string,
  complete?: (result: T) => void,
) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: action,
    onSuccess: async (result) => {
      await client.invalidateQueries({
        predicate: ({ queryKey: [scope, key] }) =>
          scope === "admin" && typeof key === "string" &&
          resources.some((resource) => key === resource || key.startsWith(`${resource}/`)),
      });
      if (success) toast.success(success);
      complete?.(result);
    },
    onError: (error) => {
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        void client.invalidateQueries({ queryKey: authKeys.me });
      }
    },
  });
}

export function errorFields(error: unknown): Record<string, string[]> {
  if (!(error instanceof ApiError) || !error.details || typeof error.details !== "object") return {};
  const { errors } = error.details as { errors?: Record<string, string[]> };
  return errors ?? {};
}

export function errorMessage(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 0) return "Could not reach the server. Check your connection and try again.";
    if (error.status === 401) return "Your session has expired. Sign in again to continue.";
    if (error.status === 403) return "You don’t have permission to perform this action.";
    if (error.status === 404) return "This item could not be found.";
    if (error.status >= 500) return "The server could not complete the request. Try again.";
  }
  return error instanceof Error ? error.message : "Something went wrong. Try again.";
}
