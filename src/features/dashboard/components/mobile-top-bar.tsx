import Logo from "@/components/Logo";
import ThemeSwitch from "@/components/ThemeSwitch";
import { CreditBadge } from "./credit-badge";
import { MobileNavSheet } from "./mobile-nav-sheet";

export function MobileTopBar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-5 lg:hidden">
      <Logo />
      <div className="flex items-center gap-2">
        <CreditBadge />
        <ThemeSwitch />
        <MobileNavSheet />
      </div>
    </header>
  );
}