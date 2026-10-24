import Logo from "@/components/Logo";
import AuthButtons from "@/components/AuthButtons";
import DashboardLink from "@/components/DashboardLink";
import HamburgerMenu from "@/components/HamburgerMenu";

type MainHeaderProps = {
  isLoggedIn?: boolean;
};

export default function MainHeader({ isLoggedIn = false }: MainHeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-white">
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-5 py-[11.5px] md:h-[72px] md:px-[120px] md:py-[15.5px]">
        <Logo />
        {isLoggedIn ? (
          <DashboardLink />
        ) : (
          <div className="flex items-center gap-3">
            <AuthButtons />
            <HamburgerMenu />
          </div>
        )}
      </div>
    </header>
  );
}