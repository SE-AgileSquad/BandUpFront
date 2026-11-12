import { z } from "zod";
import { normalizeEmail } from "@/lib/email";
import { LOGIN_COPY } from "../constants/login";

const { errors } = LOGIN_COPY;

const email = z.string().refine((value) => normalizeEmail(value) !== null, {
    message: errors.email,
});

const captchaToken = z
    .string()
    .nullable()
    .refine((value) => Boolean(value), { message: errors.captcha });

export const passwordLoginSchema = z.object({
    email,
    password: z.string().min(1, { message: errors.password }),
    captchaToken,
});

export const emailLoginSchema = z.object({ email, captchaToken });

export type PasswordLoginValues = z.infer<typeof passwordLoginSchema>;
export type EmailLoginValues = z.infer<typeof emailLoginSchema>;
