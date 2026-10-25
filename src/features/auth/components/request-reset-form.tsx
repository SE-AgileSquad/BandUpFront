"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LOGIN_PATH } from "../constants/auth.constants";
import {
    AUTH_INPUT_CLASSNAME,
    AUTH_LABEL_CLASSNAME,
    AUTH_SUBMIT_CLASSNAME,
} from "../constants/auth.styles";
import {
    forgotPasswordSchema,
    type ForgotPasswordValues,
} from "../schemas/forgot-password.schema";
import { FieldMessage } from "./field-message";
import { FormAlert } from "./form-alert";

interface RequestResetFormProps {
    initialEmail: string;
    isSubmitting?: boolean;
    errorMessage?: string;
    onSubmit: (email: string) => void;
}

export function RequestResetForm({
    initialEmail,
    isSubmitting = false,
    errorMessage,
    onSubmit,
}: RequestResetFormProps) {
    const form = useForm<ForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema),
        mode: "onTouched",
        reValidateMode: "onChange",
        shouldFocusError: true,
        defaultValues: { email: initialEmail },
    });

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(({ email }) => onSubmit(email))}
                noValidate
                className="flex flex-col gap-7"
            >
                {errorMessage && <FormAlert variant="error">{errorMessage}</FormAlert>}

                <fieldset
                    disabled={isSubmitting}
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
                                        autoFocus
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
                    Send reset code
                </Button>

                <div className="flex items-center justify-center gap-1.5 text-body">
                    <span className="text-muted-foreground">Remembered your password?</span>
                    <Link href={LOGIN_PATH} className="font-medium text-primary underline">
                        Sign in
                    </Link>
                </div>
            </form>
        </Form>
    );
}