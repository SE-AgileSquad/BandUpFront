import { ROUTES } from "./routes";

export type NavLink = {
  label: string;
  href: string;
  hidden?: boolean;
  audience?: "guest" | "user";
};

export type FooterColumnData = {
  title: string;
  authAware?: boolean;
  links: NavLink[];
};

const METHOD: NavLink = { label: "The method", href: `${ROUTES.HOME}#method` };
const FEATURES: NavLink = { label: "Features", href: `${ROUTES.HOME}#features` };
const WRITING_FEEDBACK: NavLink = {
  label: "Writing feedback",
  href: `${ROUTES.HOME}#writing-feedback`,
};
const FAQ: NavLink = { label: "FAQ", href: `${ROUTES.HOME}#faq`, hidden: true };

export const NAV_LINKS: NavLink[] = [METHOD, FEATURES, WRITING_FEEDBACK, FAQ];

export const FOOTER_COLUMNS: FooterColumnData[] = [
  { title: "Product", links: [METHOD, FEATURES, WRITING_FEEDBACK] },
  {
    title: "Account",
    authAware: true,
    links: [
      { label: "Log in", href: ROUTES.LOGIN, audience: "guest" },
      { label: "Sign up", href: ROUTES.REGISTER, audience: "guest" },
      { label: "Dashboard", href: ROUTES.DASHBOARD, audience: "user" },
      FAQ,
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: ROUTES.PRIVACY },
      { label: "Terms", href: ROUTES.TERMS },
      { label: "Contact", href: ROUTES.CONTACT },
    ],
  },
];

export function filterLinks(links: NavLink[], isAuthenticated = false) {
  return links.filter(
    (link) =>
      !link.hidden &&
      (!link.audience || (link.audience === "user") === isAuthenticated),
  );
}