import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Enter your email.")
    .email("Enter a valid email address."),
});

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;