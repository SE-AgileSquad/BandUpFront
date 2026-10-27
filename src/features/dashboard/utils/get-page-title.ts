import { PAGE_TITLE_FALLBACK } from "../constants/dashboard.constants";
import { USER_MENU_ITEMS, USER_NAV_ITEMS } from "../constants/user-nav";
import { isNavItemActive } from "./is-nav-item-active";

export function getPageTitle(pathname: string): string {
    const match = [...USER_NAV_ITEMS, ...USER_MENU_ITEMS].find((item) =>
        isNavItemActive(pathname, item.href),
    );

    return match?.label ?? PAGE_TITLE_FALLBACK;
}