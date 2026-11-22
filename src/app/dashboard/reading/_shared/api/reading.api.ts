import { api } from "@/lib/axios";
import { READING_API_PREFIX, SUBMIT_TIMEOUT_MS } from "../constants/reading";
import type {
  PassageSummary,
  ReadingApi,
  ResultPayload,
  StartAttemptResponse,
} from "../types";

const P = READING_API_PREFIX;

export const readingApi: ReadingApi = {
  async listPassages() {
    const { data } = await api.get<{ items: PassageSummary[] }>(`${P}/passages`);
    return data;
  },
  async startAttempt(passageId) {
    const { data } = await api.post<StartAttemptResponse>(`${P}/attempts`, { passageId });
    return data;
  },
  async submitAttempt(attemptId, payload) {
    const { data } = await api.post<ResultPayload>(
      `${P}/attempts/${encodeURIComponent(attemptId)}/submit`,
      payload,
      {
        timeout: SUBMIT_TIMEOUT_MS,
        headers: { "Idempotency-Key": payload.idempotencyKey },
      },
    );
    return data;
  },
  async getResult(attemptId) {
    const { data } = await api.get<ResultPayload>(
      `${P}/attempts/${encodeURIComponent(attemptId)}/result`,
    );
    return data;
  },
};