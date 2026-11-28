import { env } from "@/config/env";
import { readingMockApi } from "../mock/reading.mock";
import type { ReadingApi } from "../types";
import { readingApi as realApi } from "./reading.api";

export const readingApi: ReadingApi = env.useMockApi ? readingMockApi : realApi;