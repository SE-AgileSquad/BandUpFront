import { z } from "zod";
import {
  DISPLAY_NAME_MAX_LENGTH,
  DISPLAY_NAME_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_RULE_MESSAGE,
} from "../constants/auth.constants";

const DISPLAY_NAME_MESSAGE = "Display name must be 2–60 characters.";

const passwordRule = z
  .string()
  .min(PASSWORD_MIN_LENGTH, PASSWORD_RULE_MESSAGE)
  .max(PASSWORD_MAX_LENGTH, "Password must be 72 characters or fewer.")
  .regex(/[A-Za-z]/, PASSWORD_RULE_MESSAGE)
  .regex(/\d/, PASSWORD_RULE_MESSAGE);

export const signUpSchema = z
  .object({
    displayName: z
      .string()
      .trim()
      .min(DISPLAY_NAME_MIN_LENGTH, DISPLAY_NAME_MESSAGE)
      .max(DISPLAY_NAME_MAX_LENGTH, DISPLAY_NAME_MESSAGE),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, "Enter your email.")
      .email("Enter a valid email address."),
    password: passwordRule,
    confirmPassword: z.string().min(1, "Confirm your password."),
    captchaToken: z.string().min(1, "Please confirm you're not a robot."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

export type SignUpValues = z.infer<typeof signUpSchema>;
export type RegisterPayload = Omit<SignUpValues, "confirmPassword">;