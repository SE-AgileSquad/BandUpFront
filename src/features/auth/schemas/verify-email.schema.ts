import { z } from "zod";
import { OTP_LENGTH } from "../constants/auth.constants";

const CODE_MESSAGE = "Enter the 6-digit code.";

export const verifyEmailSchema = z.object({
  code: z
    .string()
    .length(OTP_LENGTH, CODE_MESSAGE)
    .regex(/^\d{6}$/, CODE_MESSAGE),
});

export type VerifyEmailValues = z.infer<typeof verifyEmailSchema>;