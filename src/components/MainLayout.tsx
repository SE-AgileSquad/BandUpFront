import type { ReactNode } from "react";
import MainHeader from "@/components/MainHeader";
import MainFooter from "@/components/MainFooter";

type MainLayoutProps = {
  children: ReactNode;
  isLoggedIn?: boolean;
};

export default function MainLayout({
  children,
  isLoggedIn = true,
}: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <MainHeader isLoggedIn={isLoggedIn} />
      <main className="flex-1 pt-16 md:pt-[72px]">{children}</main>
      <MainFooter />
    </div>
  );
}