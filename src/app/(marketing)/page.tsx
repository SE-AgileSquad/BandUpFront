import type { Metadata } from "next";
import { PAGE_METADATA } from "./constants/landing";
import { HeroSection } from "./components/hero-section";
import { MethodSection } from "./components/method-section";
import { FeaturesSection } from "./components/features-section";
import { CtaBanner } from "./components/cta-banner";

export const metadata: Metadata = {
    title: { absolute: PAGE_METADATA.title },
    description: PAGE_METADATA.description,
    openGraph: {
        title: PAGE_METADATA.title,
        description: PAGE_METADATA.description,
        type: "website",
        siteName: "BandUp",
    },
};

export default function MarketingPage() {
    return (
        <>
            <HeroSection />
            <MethodSection />
            <FeaturesSection />
            <CtaBanner />
        </>
    );
}