import type { Metadata } from "next";
import {
    Bot,
    BookOpenCheck,
    BookOpen,
    CircleX,
    GraduationCap,
    History,
    House,
    Languages,
    Layers,
    PenLine,
    Search,
    type LucideIcon,
} from "lucide-react";
import { DASHBOARD_ROUTES } from "./routes";

export type NavItem = { label: string; href: string; icon: LucideIcon };

export type MobileTab =
    | { kind: "link"; label: string; href: string; icon: LucideIcon }
    | { kind: "practice"; label: string; icon: LucideIcon };

export const DASHBOARD_PAGE_TITLES = {
    home: "Dashboard",
    lessons: "Lessons",
    reading: "Reading tests",
    mistakes: "My Mistakes",
    paraphrase: "Paraphrase trainer",
    wordCards: "Word cards",
    writing: "Writing",
    assistant: "Assistant",
    search: "Search",
    history: "Test history",
} as const;

const T = DASHBOARD_PAGE_TITLES;
const R = DASHBOARD_ROUTES;

export const SIDEBAR_ITEMS: NavItem[] = [
    { label: T.home, href: R.HOME, icon: House },
    { label: T.lessons, href: R.LESSONS, icon: GraduationCap },
    { label: T.reading, href: R.READING, icon: BookOpenCheck },
    { label: T.mistakes, href: R.MISTAKES, icon: CircleX },
    { label: T.paraphrase, href: R.PARAPHRASE, icon: Languages },
    { label: T.wordCards, href: R.WORD_CARDS, icon: Layers },
    { label: T.writing, href: R.WRITING, icon: PenLine },
    { label: T.assistant, href: R.ASSISTANT, icon: Bot },
    { label: T.search, href: R.SEARCH, icon: Search },
];

export const PRACTICE_ITEMS: NavItem[] = [
    { label: T.lessons, href: R.LESSONS, icon: GraduationCap },
    { label: T.reading, href: R.READING, icon: BookOpenCheck },
    { label: T.paraphrase, href: R.PARAPHRASE, icon: Languages },
    { label: T.wordCards, href: R.WORD_CARDS, icon: Layers },
    { label: T.writing, href: R.WRITING, icon: PenLine },
    { label: T.assistant, href: R.ASSISTANT, icon: Bot },
];

export const MOBILE_TABS: MobileTab[] = [
    { kind: "link", label: "Home", href: R.HOME, icon: House },
    { kind: "practice", label: "Practice", icon: BookOpen },
    { kind: "link", label: "Mistakes", href: R.MISTAKES, icon: CircleX },
    { kind: "link", label: "Search", href: R.SEARCH, icon: Search },
    { kind: "link", label: "History", href: R.HISTORY, icon: History },
];

export const DASHBOARD_COPY = {
    skipLink: "Skip to content",
    mainNavLabel: "Main",
    primaryNavLabel: "Primary",
    practiceNavLabel: "Practice",
    loading: "Loading",
    credits: {
        title: "Writing credits",
        unavailable: "Credits unavailable",
        none: "No free checks left",
        remaining: (count: number) =>
            count === 1 ? "1 Credit left" : `${count} Credits left`,
    },
    userMenu: {
        label: "Account menu",
        logOut: "Log out",
        loggingOut: "Logging out…",
    },
    practice: {
        title: "Practice",
        description: "Choose a practice area",
    },
} as const;

export function isRouteActive(pathname: string, href: string) {
    const normalizedPath = pathname.replace(/\/+$/, "") || "/";
    const normalizedHref = href.replace(/\/+$/, "") || "/";

    if (normalizedHref === DASHBOARD_ROUTES.HOME) return normalizedPath === normalizedHref;
    return normalizedPath === normalizedHref || normalizedPath.startsWith(`${normalizedHref}/`);
}

export function isPracticeActive(pathname: string) {
    return PRACTICE_ITEMS.some((item) => isRouteActive(pathname, item.href));
}

export function pageMetadata(title: string): Metadata {
    return { title: { absolute: `${title} · BandUp` } };
}

export const FOCUS_ROUTE_PATTERNS: RegExp[] = [
  /^\/dashboard\/reading\/[^/]+\/test$/,
];

export function isFocusRoute(pathname: string) {
  return FOCUS_ROUTE_PATTERNS.some((pattern) => pattern.test(pathname));
}
