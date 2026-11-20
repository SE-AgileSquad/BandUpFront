import type { Metadata } from "next";
import {
    BookOpen,
    CircleX,
    History,
    House,
    Search,
    type LucideIcon,
} from "lucide-react";
import { DASHBOARD_ROUTES } from "./routes";

export type NavItem = { label: string; href: string };

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
    { label: T.home, href: R.HOME },
    { label: T.lessons, href: R.LESSONS },
    { label: T.reading, href: R.READING },
    { label: T.mistakes, href: R.MISTAKES },
    { label: T.paraphrase, href: R.PARAPHRASE },
    { label: T.wordCards, href: R.WORD_CARDS },
    { label: T.writing, href: R.WRITING },
    { label: T.assistant, href: R.ASSISTANT },
    { label: T.search, href: R.SEARCH },
];

export const PRACTICE_ITEMS: NavItem[] = [
    { label: T.lessons, href: R.LESSONS },
    { label: T.reading, href: R.READING },
    { label: T.paraphrase, href: R.PARAPHRASE },
    { label: T.wordCards, href: R.WORD_CARDS },
    { label: T.writing, href: R.WRITING },
    { label: T.assistant, href: R.ASSISTANT },
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
            count === 1 ? "1 free check left" : `${count} free checks left`,
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
