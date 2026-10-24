import type { StaticImageData } from "next/image";
import CheckBadge from "./CheckBadge";
import Eyebrow from "./Eyebrow";
import ImageSlot from "./ImageSlot";

type FeatureRowProps = {
  eyebrow: string;
  title: string;
  lead: string;
  bullets: string[];
  imageLabel: string;
  image?: string | StaticImageData;
  imageFirst?: boolean;
};

export default function FeatureRow({
  eyebrow,
  title,
  lead,
  bullets,
  imageLabel,
  image,
  imageFirst = false,
}: FeatureRowProps) {
  return (
    <section className="bg-background px-6 py-10 lg:px-[120px] lg:py-[72px]">
      <div className="mx-auto grid w-full max-w-content gap-7 lg:grid-cols-2 lg:items-center lg:gap-20">
        <div className="flex flex-col gap-5">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="text-h2-sm font-bold text-foreground lg:text-h2">
            {title}
          </h2>
          <p className="text-lead text-muted-foreground">{lead}</p>
          <ul className="flex flex-col gap-3 pt-1">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3">
                <CheckBadge size={20} />
                <span className="text-body text-foreground">{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        <ImageSlot
          src={image}
          alt={imageLabel}
          label={imageLabel}
          className={`h-[260px] w-full lg:h-[440px] ${
            imageFirst ? "lg:order-first" : ""
          }`}
        />
      </div>
    </section>
  );
}