import { z } from "zod";
import { SEARCH_QUERY_MAX_LENGTH } from "../constants/dashboard.constants";

export const headerSearchSchema = z.object({
  q: z.string().trim().min(1).max(SEARCH_QUERY_MAX_LENGTH),
});

export type HeaderSearchValues = z.infer<typeof headerSearchSchema>;