import Link from "next/link";
import { ImageSlot, type ImageSlotProps } from "@/components/shared/image-slot";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { AUTH_PANEL } from "@/constants/auth";
import { ROUTES } from "@/constants/routes";
import { LogoAlt } from "../layout/logo-alt";

export type PanelMascot = { src: ImageSlotProps["src"]; alt: string };

export function GradientLogo() {
    return (
        <Link
            href={ROUTES.HOME}
            aria-label="BandUp home"
            className="inline-flex items-center gap-[10px] rounded-btn outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
            <span
                aria-hidden
                className="grid size-10 place-items-center rounded-logo bg-white text-[22px] leading-none font-bold text-on-gradient-cta"
            >
                B
            </span>
            <span className="text-logo text-primary-foreground">BandUp</span>
        </Link>
    );
}

type WelcomePanelProps = {
    headline?: string;
    description?: string;
    mascot?: PanelMascot;
};

export function WelcomePanel({
    headline = AUTH_PANEL.headline,
    description = AUTH_PANEL.description,
    mascot = AUTH_PANEL.mascot,
}: WelcomePanelProps) {
    return (
        <aside className="hidden w-[600px] shrink-0 flex-col justify-between rounded-r-[48px] bg-gradient-primary px-14 py-12 text-primary-foreground lg:flex">
            <LogoAlt />
            <div className="flex flex-col items-center gap-[14px]">
                <p className="max-w-[488px] text-auth-heading">{headline}</p>
                <p className="max-w-[488px] text-body opacity-[0.82]">{description}</p>
                <div className="relative size-[450px]">
                    <ImageSlot
                        src={mascot.src}
                        alt={mascot.alt}
                        sizes="450px"
                        className="rounded-frame -ml-10"
                    />
                </div>
            </div>
            <ul className="flex flex-wrap gap-[10px]">
                {AUTH_PANEL.chips.map((chip) => (
                    <li
                        key={chip}
                        className="inline-flex items-center gap-2 rounded-pill bg-white/[0.16] px-3 py-[7px] text-[12px] leading-[1.4] font-medium"
                    >
                        <span aria-hidden className="size-2 rounded-full bg-white" />
                        {chip}
                    </li>
                ))}
            </ul>
        </aside>
    );
}

export function MobileBand({ mascot = AUTH_PANEL.mascot }: { mascot?: PanelMascot }) {
    return (
        <div className="rounded-b-[40px] bg-gradient-primary px-6 py-5 text-primary-foreground lg:hidden">
            <div className="flex items-center justify-between">
                <GradientLogo />
                <ThemeToggle className="border-white/30 bg-white/[0.15] text-white hover:bg-white/25" />
            </div>
            <div className="relative mx-auto mt-4 size-[170px]">
                <ImageSlot
                    src={mascot.src}
                    alt={mascot.alt}
                    sizes="170px"
                    className="rounded-frame"
                />
            </div>
        </div>
    );
}