import { z } from "zod";
import { FORGOT_COPY, FORGOT_LIMITS } from "../constants/forgot";

const { email: emailCopy, newPassword: passwordCopy } = FORGOT_COPY;

export const emailSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email(emailCopy.errors.email),
});

export const newPasswordSchema = z
    .object({
        newPassword: z
            .string()
            .min(FORGOT_LIMITS.passwordMin, { message: passwordCopy.errors.length })
            .refine((value) => /[A-Za-z]/.test(value) && /\d/.test(value), {
                message: passwordCopy.errors.mix,
            }),
        confirmPassword: z.string(),
    })
    .refine((values) => values.newPassword === values.confirmPassword, {
        message: passwordCopy.errors.mismatch,
        path: ["confirmPassword"],
    });

export type EmailFormValues = z.infer<typeof emailSchema>;
export type NewPasswordFormValues = z.infer<typeof newPasswordSchema>;
