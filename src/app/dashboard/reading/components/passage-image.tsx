"use client";

import { useState } from "react";
import Image from "next/image";
import { BookOpen } from "lucide-react";

export function PassageImage({ src }: { src: string | null }) {
    const [failedSrc, setFailedSrc] = useState<string | null>(null);

    return (
        <div className="relative grid h-[110px] w-full place-items-center overflow-hidden rounded-frame bg-muted">
            {src && failedSrc !== src ? (
                <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
                    className="object-contain"
                    onError={() => setFailedSrc(src)}
                />
            ) : (
                <BookOpen aria-hidden className="size-8 text-muted-foreground" />
            )}
        </div>
    );
}