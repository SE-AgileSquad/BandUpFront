import type { ImageSlotProps } from "@/components/shared/image-slot";

export const AUTH_REDIRECT_DELAY_MS = 2500;

export const AUTH_PANEL: {
  headline: string;
  description: string;
  chips: string[];
  mascot: { src: ImageSlotProps["src"]; alt: string };
} = {
  headline: "Every mistake is a lesson in disguise.",
  description:
    "Practice IELTS Reading and Writing, see exactly why you lost marks, and watch those mistakes turn into progress.",
  chips: ["Free to start", "3 free Writing checks", "No card needed"],
  mascot: { src: '/images/auth/img_mascot_register.png', alt: "BandUp mascot" },
};