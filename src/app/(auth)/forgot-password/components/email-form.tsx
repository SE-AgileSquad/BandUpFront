"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { FieldInput, FormField } from "@/components/auth/form-field";
import { ROUTES } from "@/constants/routes";
import { FORGOT_COPY } from "../constants/forgot";
import { useForgotFlow, useForgotFlowReady } from "../hooks/use-forgot-flow";
import { emailSchema, type EmailFormValues } from "../schemas/forgot.schema";

function EmailFormFields() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitted },
    } = useForm<EmailFormValues>({
        resolver: zodResolver(emailSchema),
        mode: "onSubmit",
        reValidateMode: "onChange",
        defaultValues: { email: useForgotFlow.getState().email },
    });

    const hasErrors = Object.keys(errors).length > 0;
    const submitDisabled = isSubmitted && hasErrors;

    const onSubmit = handleSubmit((values) => {
        useForgotFlow.getState().setEmail(values.email);
        router.push(ROUTES.FORGOT_PASSWORD_NEW);
    });

    const copy = FORGOT_COPY.email;

    return (
        <>
            <form
                onSubmit={onSubmit}
                noValidate
                className="flex flex-col gap-[14px] lg:gap-[18px]"
            >
                <div className="flex flex-col gap-2">
                    <h1 className="text-auth-title">{copy.title}</h1>
                    <p className="text-[15px] leading-[22px] text-muted-foreground">
                        {copy.subtitle}
                    </p>
                </div>

                <FormField
                    label={copy.label}
                    helper={copy.helper}
                    error={errors.email?.message}
                >
                    <FieldInput
                        type="email"
                        inputMode="email"
                        placeholder={copy.placeholder}
                        autoComplete="email"
                        {...register("email")}
                    />
                </FormField>

                <Button
                    type="submit"
                    variant="gradient"
                    size="default"
                    className="w-full"
                    disabled={submitDisabled}
                >
                    {copy.submit}
                </Button>
            </form>

            <Link
                href={ROUTES.LOGIN}
                className="self-center rounded-sm text-[14px] leading-[21px] font-semibold text-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-primary/25"
            >
                {copy.back}
            </Link>
        </>
    );
}

export function EmailForm() {
    const ready = useForgotFlowReady();

    if (!ready) return <div aria-hidden className="min-h-[360px]" />;

    return <EmailFormFields />;
}
