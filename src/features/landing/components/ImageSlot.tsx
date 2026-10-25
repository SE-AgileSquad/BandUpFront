import Image, { type StaticImageData } from "next/image";
import { cn } from "@/lib/utils";

type ImageSlotProps = {
  src?: string | StaticImageData;
  alt: string;
  label: string;
  className?: string;
  priority?: boolean;
};

export default function ImageSlot({
  src,
  alt,
  label,
  className,
  priority,
}: ImageSlotProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[20px]",
        !src &&
          "flex items-center justify-center border-[1.5px] border-dashed border-border bg-muted",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 568px, 342px"
          className="object-cover"
        />
      ) : (
        <span className="text-small text-muted-foreground">{label}</span>
      )}
    </div>
  );
}
