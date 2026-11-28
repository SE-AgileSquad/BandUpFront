"use client";

import { useState } from "react";
import Image from "next/image";
import { BookOpen } from "lucide-react";

export function PassageImage({ src }: { src: string | null }) {
    const [failedSrc, setFailedSrc] = useState<string | null>(null);

    return (
        <div className="relative grid h-[180px] w-full place-items-center overflow-hidden rounded-t-frame bg-muted">
            {src && failedSrc !== src ? (
                <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
                    className="object-cover object-top [mask-image:linear-gradient(to_bottom,#000_55%,transparent_100%)]"
                    onError={() => setFailedSrc(src)}
                />
            ) : (
                <BookOpen aria-hidden className="size-8 text-muted-foreground" />
            )}
        </div>
    );
}
