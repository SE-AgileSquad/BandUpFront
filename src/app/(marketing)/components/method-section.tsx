import { cn } from "@/lib/utils";
import { METHOD } from "../constants/landing";

export function MethodSection() {
    return (
        <section
            id="method"
            aria-labelledby="method-title"
            className="container-page scroll-mt-24"
        >
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-3">
                    <p className="text-eyebrow text-primary">{METHOD.eyebrow}</p>
                    <h2 id="method-title" className="text-h2">
                        {METHOD.title}
                    </h2>
                </div>
                <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    {METHOD.steps.map((step) => (
                        <li
                            key={step.number}
                            className={cn(
                                "flex flex-col gap-[10px] rounded-card border px-[22px] py-6 sm:last:col-span-2 xl:last:col-span-1",
                                step.highlighted
                                    ? "bg-gradient-primary text-primary-foreground"
                                    : "bg-card",
                            )}
                        >
                            <span
                                className={cn(
                                    "text-[13px] leading-[1.4] font-bold",
                                    step.highlighted ? "text-primary-foreground" : "text-primary",
                                )}
                            >
                                {step.number}
                            </span>
                            <h3
                                className={cn(
                                    "text-card-title",
                                    step.highlighted ? "text-primary-foreground" : "text-foreground",
                                )}
                            >
                                {step.title}
                            </h3>
                            <p
                                className={cn(
                                    "text-body-sm",
                                    step.highlighted
                                        ? "text-primary-foreground"
                                        : "text-muted-foreground",
                                )}
                            >
                                {step.description}
                            </p>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}