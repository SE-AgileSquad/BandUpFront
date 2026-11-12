import type { ReactNode } from "react";
import { CircleAlert, CircleCheck, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type StatusNoticeProps = {
    variant: "error" | "success" | "info";
    title: string;
    description: string;
    icon?: ReactNode;
    className?: string;
};

const variants = {
    error: {
        box: "border-destructive bg-destructive-bg text-destructive",
        Icon: CircleAlert,
        role: "alert",
    },
    success: {
        box: "border-success bg-success-bg text-success",
        Icon: CircleCheck,
        role: "status",
    },
    info: {
        box: "border-primary bg-primary-soft text-primary",
        Icon: Info,
        role: "status",
    },
} as const;

export function StatusNotice({
    variant,
    title,
    description,
    icon,
    className,
}: StatusNoticeProps) {
    const { box, Icon, role } = variants[variant];

    return (
        <div
            role={role}
            className={cn("flex gap-3 rounded-frame border p-[14px]", box, className)}
        >
            <span className="mt-0.5 shrink-0">
                {icon ?? <Icon aria-hidden className="size-4" />}
            </span>
            <div className="flex flex-col gap-0.5">
                <p className="text-[14px] leading-[21px] font-medium">{title}</p>
                <p className="text-[13px] leading-[1.6]">{description}</p>
            </div>
        </div>
    );
}