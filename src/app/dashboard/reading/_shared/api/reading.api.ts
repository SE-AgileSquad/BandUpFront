import { api } from "@/lib/axios";
import { env } from "@/config/env";
import { getLoopbackApiUrl } from "@/config/local-api";
import { READING_API_PREFIX, SUBMIT_TIMEOUT_MS } from "../constants/reading";
import type { ReadingApi } from "../types";
import {
  toPassageSummary,
  toResult,
  toStartedAttempt,
  type AttemptDto,
  type AttemptResultDto,
  type AttemptSummaryDto,
  type PassageDto,
  type PassageSummaryDto,
} from "./reading-contract";

const attemptsPath = "/api/attempts";
const answerUpdates = new Map<string, Promise<void>>();

function submitViaLocalFrontend() {
  return process.env.NODE_ENV === "development" && typeof window !== "undefined" &&
    getLoopbackApiUrl(env.apiUrl)?.hostname === window.location.hostname;
}

export const readingApi: ReadingApi = {
  async listPassages() {
    const [{ data: passages }, { data: attempts }] = await Promise.all([
      api.get<{ items: PassageSummaryDto[] }>(READING_API_PREFIX + "/passages?page=1&pageSize=20"),
      api.get<AttemptSummaryDto[]>(attemptsPath + "/summary"),
    ]);
    const byPassage = new Map(attempts.map((attempt) => [attempt.passageId, attempt]));
    const receivedAt = Date.now();
    return { items: passages.items.map((passage) => toPassageSummary(passage, byPassage.get(passage.id), receivedAt)) };
  },
  async startAttempt(passageId) {
    const { data: passage } = await api.get<PassageDto>(`${READING_API_PREFIX}/passages/${encodeURIComponent(passageId)}`);
    const { data: attempt } = await api.post<AttemptDto>(attemptsPath, { passageId });
    return toStartedAttempt(attempt, passage);
  },
  async updateAnswer(attemptId, questionId, selectedAnswer) {
    const key = `${attemptId}:${questionId}`;
    const previous = answerUpdates.get(key) ?? Promise.resolve();
    const pending = previous.catch(() => undefined).then(async () => {
      await api.put(
        `${attemptsPath}/${encodeURIComponent(attemptId)}/answers/${encodeURIComponent(questionId)}`,
        { selectedAnswer },
      );
    });
    answerUpdates.set(key, pending);
    try {
      await pending;
    } finally {
      if (answerUpdates.get(key) === pending) answerUpdates.delete(key);
    }
  },
  async waitForAnswerUpdates(attemptId) {
    const prefix = `${attemptId}:`;
    await Promise.all([...answerUpdates.entries()]
      .filter(([key]) => key.startsWith(prefix))
      .map(([, pending]) => pending.catch(() => undefined)));
  },
  async submitAttempt(attemptId, payload) {
    const useLocalProxy = submitViaLocalFrontend();
    const path = `${attemptsPath}/${encodeURIComponent(attemptId)}/submit`;
    const { data } = await api.post<AttemptResultDto>(
      useLocalProxy ? path + "/" : path,
      { answers: Object.entries(payload.answers).map(([questionId, selectedAnswer]) => ({ questionId, selectedAnswer })) },
      {
        timeout: SUBMIT_TIMEOUT_MS,
        headers: { "Idempotency-Key": payload.idempotencyKey },
        ...(useLocalProxy ? { baseURL: window.location.origin } : {}),
      },
    );
    return toResult(data);
  },
  async getResult(attemptId) {
    const { data } = await api.get<AttemptResultDto>(`${attemptsPath}/${encodeURIComponent(attemptId)}/result`);
    return toResult(data);
  },
};
