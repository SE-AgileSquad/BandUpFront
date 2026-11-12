import { z } from "zod";
import { REGISTER_COPY, REGISTER_LIMITS } from "../constants/register";
    import { normalizeEmail } from "@/lib/email";

const { errors } = REGISTER_COPY;

export const registerSchema = z.object({
    fullName: z
        .string()
        .trim()
        .refine((value) => value.split(/\s+/).filter(Boolean).length >= 2, {
            message: errors.fullName,
        }),
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