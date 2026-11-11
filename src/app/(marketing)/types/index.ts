import type { ImageSlotProps } from "@/components/shared/image-slot";

export type LandingImage = {
  src: ImageSlotProps["src"];
  alt: string;
};

export type CtaLinkContent = { label: string; href: string };

export type AuthCtaContent = {
  guest: CtaLinkContent;
  authed: CtaLinkContent;
};

export type HeroContent = {
  pill: string;
  titleLead: string;
  titleAccent: string;
  lead: string;
  cta: AuthCtaContent;
  secondary: CtaLinkContent;
  reassurance: string[];
  image: LandingImage;
};

export type MethodStep = {
  number: string;
  title: string;
  description: string;
  highlighted?: boolean;
};

export type MethodContent = {
  eyebrow: string;
  title: string;
  steps: MethodStep[];
};

export type FeatureRowData = {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  image: LandingImage;
  reversed?: boolean;
};

export type FeaturesContent = {
  srTitle: string;
  rows: FeatureRowData[];
};

export type CtaBannerContent = {
  title: string;
  description: string;
  cta: AuthCtaContent;
  image: LandingImage;
};