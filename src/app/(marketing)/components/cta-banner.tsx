import { ImageSlot } from "@/components/shared/image-slot";
import { CTA_BANNER } from "../constants/landing";
import { AuthCta } from "./auth-cta";

export function CtaBanner() {
    return (
        <section aria-labelledby="cta-title" className="container-page">
            <div className="flex flex-col items-center gap-5 rounded-banner bg-gradient-primary px-6 pt-8 text-primary-foreground lg:flex-row lg:items-stretch lg:px-16 lg:pt-12">
                <div className="flex w-full flex-col justify-center gap-4 lg:flex-1 lg:pb-12">
                    <h2 id="cta-title" className="text-h1-cta text-primary-foreground">
                        {CTA_BANNER.title}
                    </h2>
                    <p className="max-w-[782px] text-body opacity-85">
                        {CTA_BANNER.description}
                    </p>
                    <div>
                        <AuthCta content={CTA_BANNER.cta} variant="on-gradient" />
                    </div>
                </div>
                <div className="relative size-[220px] shrink-0 self-center lg:size-80 lg:self-end -mb-8 lg:-mb-[47px]">
                    <ImageSlot
                        src={CTA_BANNER.image.src}
                        alt={CTA_BANNER.image.alt}
                        sizes="(min-width: 1024px) 320px, 220px"
                    />
                </div>
            </div>
        </section>
    );
}