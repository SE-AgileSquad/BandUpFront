import { Check } from "lucide-react";
import { ImageSlot } from "@/components/shared/image-slot";
import { cn } from "@/lib/utils";
import type { FeatureRowData } from "../types";

export function FeatureRow({
    id,
    eyebrow,
    title,
    description,
    bullets,
    image,
    reversed,
}: FeatureRowData) {
    return (
        <div
            id={id}
            className={cn(
                "flex scroll-mt-24 flex-col gap-5 lg:items-center lg:gap-[60px]",
                reversed ? "lg:flex-row-reverse" : "lg:flex-row",
            )}
        >
            <div className="flex flex-col gap-[14px] lg:flex-1">
                <p className="text-eyebrow text-primary">{eyebrow}</p>
                <h3 className="text-h3">{title}</h3>
                <p className="text-body text-muted-foreground">{description}</p>
                <ul className="flex flex-col gap-2">
                    {bullets.map((bullet) => (
                        <li
                            key={bullet}
                            className="flex items-start gap-2 text-[14px] leading-[21px] font-medium text-foreground"
                        >
                            <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
                            {bullet}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="relative h-[220px] w-full shrink-0 overflow-hidden rounded-frame lg:h-[340px] lg:w-[520px]">
                <ImageSlot
                    src={image.src}
                    alt={image.alt}
                    sizes="(min-width: 1024px) 520px, 100vw"
                />
            </div>
        </div>
    );
}