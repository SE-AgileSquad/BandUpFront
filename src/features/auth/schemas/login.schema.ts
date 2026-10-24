import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Enter your email.")
    .email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
  captchaToken: z.string().min(1, "Please confirm you're not a robot."),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type LoginPayload = LoginValues;