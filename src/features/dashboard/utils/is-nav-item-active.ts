import { DASHBOARD_HOME_PATH } from "../constants/dashboard.constants";

export function isNavItemActive(pathname: string, href: string): boolean {
    if (href === DASHBOARD_HOME_PATH) {
        return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
}