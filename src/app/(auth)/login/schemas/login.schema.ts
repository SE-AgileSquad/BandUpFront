import { z } from "zod";
import { normalizePhone } from "@/lib/phone";
import { LOGIN_COPY } from "../constants/login";

const { errors } = LOGIN_COPY;

const phone = z
    .string()
    .refine((value) => normalizePhone(value) !== null, { message: errors.phone });

const captchaToken = z
    .string()
    .nullable()
    .refine((value) => Boolean(value), { message: errors.captcha });

export const passwordLoginSchema = z.object({
    phone,
    password: z.string().min(1, { message: errors.password }),
    captchaToken,
});

export const smsLoginSchema = z.object({ phone, captchaToken });

export type PasswordLoginValues = z.infer<typeof passwordLoginSchema>;
export type SmsLoginValues = z.infer<typeof smsLoginSchema>;