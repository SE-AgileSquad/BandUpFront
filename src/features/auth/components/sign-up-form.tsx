"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    EMAIL_EXISTS_ERROR_TYPE,
    LOGIN_PATH,
    PASSWORD_RULE_MESSAGE,
} from "../constants/auth.constants";
import {
    AUTH_INPUT_CLASSNAME,
    AUTH_LABEL_CLASSNAME,
    AUTH_MESSAGE_CLASSNAME,
    AUTH_SUBMIT_CLASSNAME,
} from "../constants/auth.styles";
import { useSignUpForm } from "../hooks/use-sign-up-form";
import type { SignUpValues } from "../schemas/sign-up.schema";
import type { VerificationEntry } from "../types/auth.types";
import { CaptchaField } from "./captcha-field";
import { EmailExistsMessage } from "./email-exists-message";
import { FormAlert } from "./form-alert";
import { PasswordInput } from "./password-input";
import { FieldMessage } from "./field-message";

interface SignUpFormProps {
    defaultValues: Pick<SignUpValues, "displayName" | "email">;
    onRegistered: (entry: VerificationEntry) => void;
}

export function SignUpForm({ defaultValues, onRegistered }: SignUpFormProps) {
    const { form, captchaRef, banner, isPending, hasCaptchaToken, onSubmit } =
        useSignUpForm({ defaultValues, onRegistered });

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} noValidate className="flex flex-col gap-7">
                {banner && <FormAlert variant="error">{banner}</FormAlert>}

                <fieldset
                    disabled={isPending}
                    className="m-0 flex min-w-0 flex-col gap-4 border-0 p-0"
                >
                    <FormField
                        control={form.control}
                        name="displayName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className={AUTH_LABEL_CLASSNAME}>Display name</FormLabel>
                                <FormControl>
                                    <Input {...field} autoComplete="name" className={AUTH_INPUT_CLASSNAME} />
                                </FormControl>
                                <FieldMessage className={AUTH_MESSAGE_CLASSNAME} />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormLabel className={AUTH_LABEL_CLASSNAME}>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="email"
                                        inputMode="email"
                                        autoComplete="email"
                                        className={AUTH_INPUT_CLASSNAME}
                                    />
                                </FormControl>
                                {fieldState.error?.type === EMAIL_EXISTS_ERROR_TYPE ? (
                                    <EmailExistsMessage />
                                ) : (
                                    <FieldMessage className={AUTH_MESSAGE_CLASSNAME} />
                                )}
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormLabel className={AUTH_LABEL_CLASSNAME}>Password</FormLabel>
                                <FormControl>
                                    <PasswordInput
                                        {...field}
                                        autoComplete="new-password"
                                        className={AUTH_INPUT_CLASSNAME}
                                    />
                                </FormControl>
                                {fieldState.error ? (
                                    <FieldMessage className={AUTH_MESSAGE_CLASSNAME} />
                                ) : (
                                    <FormDescription className="text-small text-muted-foreground">
                                        {PASSWORD_RULE_MESSAGE}
                                    </FormDescription>
                                )}
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className={AUTH_LABEL_CLASSNAME}>Confirm password</FormLabel>
                                <FormControl>
                                    <PasswordInput
                                        {...field}
                                        autoComplete="new-password"
                                        className={AUTH_INPUT_CLASSNAME}
                                    />
                                </FormControl>
                                <FieldMessage className={AUTH_MESSAGE_CLASSNAME} />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="captchaToken"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <CaptchaField
                                    ref={captchaRef}
                                    value={field.value}
                                    onChange={field.onChange}
                                    hasError={Boolean(fieldState.error)}
                                    disabled={isPending}
                                />
                                <FieldMessage className={AUTH_MESSAGE_CLASSNAME} />
                            </FormItem>
                        )}
                    />
                </fieldset>

                <Button
                    type="submit"
                    disabled={!hasCaptchaToken || isPending}
                    className={AUTH_SUBMIT_CLASSNAME}
                >
                    {isPending && <Loader2 className="animate-spin" aria-hidden="true" />}
                    Create account
                </Button>

                <div className="flex items-center justify-center gap-1.5 text-body">
                    <span className="text-muted-foreground">Already have an account?</span>
                    <Link href={LOGIN_PATH} className="font-medium text-primary underline">
                        Sign in
                    </Link>
                </div>
            </form>
        </Form>
    );
}