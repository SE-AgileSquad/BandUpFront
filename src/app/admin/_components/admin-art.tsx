import Image from "next/image";
import { cn } from "@/lib/utils";

export type AdminArtName = "overview" | "passages" | "lessons" | "writing" | "mapping" | "users" | "empty";

export function AdminArt({ name, sizes, className }: {
  name: AdminArtName;
  sizes: string;
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none relative shrink-0 select-none", className)}>
      <Image
        src={`/images/admin/${name}.webp`}
        alt=""
        fill
        sizes={sizes}
        className="object-contain"
      />
    </div>
  );
}
