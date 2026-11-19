import { z } from "zod";
import { normalizeEmail } from "@/lib/email";
import { REGISTER_COPY, REGISTER_LIMITS } from "../constants/register";

const { errors } = REGISTER_COPY;

export const registerSchema = z.object({
    displayName: z
        .string()
        .trim()
        .min(1, { message: errors.displayName }),
    email: z
        .string()
        .refine((value) => normalizeEmail(value) !== null, {
            message: errors.email,
        }),
    password: z
        .string()
        .min(REGISTER_LIMITS.passwordMin, { message: errors.passwordLength })
        .refine((value) => /[A-Za-z]/.test(value) && /\d/.test(value), {
            message: errors.passwordMix,
        }),
    captchaToken: z
        .string()
        .nullable()
        .refine((value) => Boolean(value), { message: errors.captcha }),
    acceptedTerms: z.boolean().refine((value) => value, { message: errors.terms }),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
