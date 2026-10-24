"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    FORGOT_PASSWORD_PATH,
    REGISTER_PATH,
} from "../constants/auth.constants";
import {
    AUTH_INPUT_CLASSNAME,
    AUTH_LABEL_CLASSNAME,
    AUTH_SUBMIT_CLASSNAME,
} from "../constants/auth.styles";
import { useLoginForm } from "../hooks/use-login-form";
import { CaptchaField } from "./captcha-field";
import { FieldMessage } from "./field-message";
import { FormAlert } from "./form-alert";
import { PasswordInput } from "./password-input";

export function LoginForm() {
    const { form, captchaRef, banner, isPending, hasCaptchaToken, onSubmit } =
        useLoginForm();

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
                        name="email"
                        render={({ field }) => (
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
                                <FieldMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center justify-between gap-2">
                                    <FormLabel className={AUTH_LABEL_CLASSNAME}>Password</FormLabel>
                                    <Link
                                        href={FORGOT_PASSWORD_PATH}
                                        className="text-small font-medium text-primary hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <FormControl>
                                    <PasswordInput
                                        {...field}
                                        autoComplete="current-password"
                                        className={AUTH_INPUT_CLASSNAME}
                                    />
                                </FormControl>
                                <FieldMessage />
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
                                <FieldMessage />
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
                    Sign in
                </Button>

                <div className="flex items-center justify-center gap-1.5 text-body">
                    <span className="text-muted-foreground">Don&apos;t have an account?</span>
                    <Link href={REGISTER_PATH} className="font-medium text-primary underline">
                        Create one
                    </Link>
                </div>
            </form>
        </Form>
    );
}