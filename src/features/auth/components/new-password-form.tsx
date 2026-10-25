"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { PASSWORD_RULE_MESSAGE } from "../constants/auth.constants";
import {
    AUTH_INPUT_CLASSNAME,
    AUTH_LABEL_CLASSNAME,
    AUTH_SUBMIT_CLASSNAME,
} from "../constants/auth.styles";
import {
    resetPasswordSchema,
    type ResetPasswordValues,
} from "../schemas/reset-password.schema";
import { FieldMessage } from "./field-message";
import { FormAlert } from "./form-alert";
import { PasswordInput } from "./password-input";

interface NewPasswordFormProps {
    isSubmitting?: boolean;
    errorMessage?: string;
    isSessionExpired?: boolean;
    onSubmit: (password: string) => void;
    onRestart: () => void;
}

export function NewPasswordForm({
    isSubmitting = false,
    errorMessage,
    isSessionExpired = false,
    onSubmit,
    onRestart,
}: NewPasswordFormProps) {
    const form = useForm<ResetPasswordValues>({
        resolver: zodResolver(resetPasswordSchema),
        mode: "onTouched",
        reValidateMode: "onChange",
        shouldFocusError: true,
        defaultValues: { password: "", confirmPassword: "" },
    });

    useEffect(() => {
        const subscription = form.watch((_values, { name }) => {
            if (name === "password" && form.getValues("confirmPassword")) {
                void form.trigger("confirmPassword");
            }
        });
        return () => subscription.unsubscribe();
    }, [form]);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(({ password }) => onSubmit(password))}
                noValidate
                className="flex flex-col gap-7"
            >
                {isSessionExpired && (
                    <FormAlert variant="error">
                        Your reset session has expired. Please start again.
                        <button
                            type="button"
                            onClick={onRestart}
                            className="mt-2 block font-medium underline"
                        >
                            Start again
                        </button>
                    </FormAlert>
                )}
                {errorMessage && <FormAlert variant="error">{errorMessage}</FormAlert>}

                <fieldset
                    disabled={isSubmitting}
                    className="m-0 flex min-w-0 flex-col gap-4 border-0 p-0"
                >
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormLabel className={AUTH_LABEL_CLASSNAME}>New password</FormLabel>
                                <FormControl>
                                    <PasswordInput
                                        {...field}
                                        autoComplete="new-password"
                                        autoFocus
                                        className={AUTH_INPUT_CLASSNAME}
                                    />
                                </FormControl>
                                {fieldState.error ? (
                                    <FieldMessage />
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
                                <FormLabel className={AUTH_LABEL_CLASSNAME}>
                                    Confirm new password
                                </FormLabel>
                                <FormControl>
                                    <PasswordInput
                                        {...field}
                                        autoComplete="new-password"
                                        className={AUTH_INPUT_CLASSNAME}
                                    />
                                </FormControl>
                                <FieldMessage />
                            </FormItem>
                        )}
                    />
                </fieldset>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={AUTH_SUBMIT_CLASSNAME}
                >
                    {isSubmitting && <Loader2 className="animate-spin" aria-hidden="true" />}
                    Reset password
                </Button>
            </form>
        </Form>
    );
}