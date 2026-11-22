import Image from "next/image";
import { cn } from "@/lib/utils";

export type ImageSlotProps = {
    src?: string | { light: string; dark: string };
    alt: string;
    priority?: boolean;
    loading?: "eager" | "lazy";
    sizes?: string;
    className?: string;
};

export function ImageSlot({ src, alt, priority, loading, sizes, className }: ImageSlotProps) {
    if (!src || (typeof src === "object" && (!src.light || !src.dark))) {
        return <div aria-hidden className={cn("absolute inset-0 bg-muted", className)} />;
    }

    if (typeof src === "string") {
        return (
            <Image
                src={src}
                alt={alt}
                fill
                priority={priority}
                loading={loading}
                sizes={sizes}
                className={cn("object-contain", className)}
            />
        );
    }

    return (
        <>
            <Image
                src={src.light}
                alt={alt}
                fill
                priority={priority}
                loading={loading}
                sizes={sizes}
                className={cn("object-contain dark:hidden", className)}
            />
            <Image
                src={src.dark}
                alt={alt}
                fill
                priority={priority}
                loading={loading}
                sizes={sizes}
                className={cn("hidden object-contain dark:block", className)}
            />
        </>
    );
}
