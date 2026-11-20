import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display",
            "h1-cta",
            "h2",
            "h3",
            "card-title",
            "lead",
            "body",
            "body-sm",
            "nav",
            "button",
            "caption",
            "eyebrow",
            "logo",
            "auth-title",
            "auth-heading",
          ],
        },
      ],
      rounded: [
        {
          rounded: ["logo", "btn", "frame", "card", "banner", "pill", "field", "nav", "dock"],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}