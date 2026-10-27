import {
    ArrowLeftRight,
    BookOpen,
    CircleX,
    FileText,
    History,
    Layers,
    LayoutDashboard,
    MessageSquare,
    PenLine,
    ScrollText,
    Search,
    type LucideIcon,
} from "lucide-react";
import { DASHBOARD_HOME_PATH } from "./dashboard.constants";

export interface NavLinkItem {
    key: string;
    label: string;
    href: string;
    icon: LucideIcon;
}

export interface UserNavItem extends NavLinkItem {
    bottomNav?: { label: string };
}

export const USER_NAV_ITEMS: readonly UserNavItem[] = [
    {
        key: "dashboard",
        label: "Dashboard",
        href: DASHBOARD_HOME_PATH,
        icon: LayoutDashboard,
        bottomNav: { label: "Dashboard" },
    },
    {
        key: "lessons",
        label: "Lessons",
        href: "/dashboard/user/lessons",
        icon: BookOpen,
        bottomNav: { label: "Lessons" },
    },
    {
        key: "reading-test",
        label: "Reading Tests",
        href: "/dashboard/user/reading-test",
        icon: FileText,
        bottomNav: { label: "Tests" },
    },
    {
        key: "paraphrase-trainer",
        label: "Paraphrase Trainer",
        href: "/dashboard/user/paraphrase-trainer",
        icon: ArrowLeftRight,
    },
    {
        key: "word-cards",
        label: "Word Cards",
        href: "/dashboard/user/word-cards",
        icon: Layers,
        bottomNav: { label: "Cards" },
    },
    {
        key: "writing",
        label: "Writing",
        href: "/dashboard/user/writing",
        icon: PenLine,
        bottomNav: { label: "Writing" },
    },
    {
        key: "assistant",
        label: "Assistant",
        href: "/dashboard/user/assistant",
        icon: MessageSquare,
    },
    {
        key: "search",
        label: "Search",
        href: "/dashboard/user/search",
        icon: Search,
    },
];

export const USER_MENU_ITEMS: readonly NavLinkItem[] = [
    {
        key: "mistakes",
        label: "My Mistakes",
        href: "/dashboard/user/mistakes",
        icon: CircleX,
    },
    {
        key: "test-history",
        label: "Test History",
        href: "/dashboard/user/test-history",
        icon: History,
    },
    {
        key: "my-essays",
        label: "My Essays",
        href: "/dashboard/user/my-essays",
        icon: ScrollText,
    },
];