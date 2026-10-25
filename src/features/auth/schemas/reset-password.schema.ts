import { z } from "zod";
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_RULE_MESSAGE,
} from "../constants/auth.constants";

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, PASSWORD_RULE_MESSAGE)
      .max(PASSWORD_MAX_LENGTH, "Password must be 72 characters or fewer.")
      .regex(/[A-Za-z]/, PASSWORD_RULE_MESSAGE)
      .regex(/\d/, PASSWORD_RULE_MESSAGE),
    confirmPassword: z.string().min(1, "Confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;