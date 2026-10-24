import type { ReactNode } from "react";
import MainHeader from "@/components/MainHeader";

type MainLayoutProps = {
  children: ReactNode;
  isLoggedIn?: boolean;
};

export default function MainLayout({
  children,
  isLoggedIn = false,
}: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <MainHeader isLoggedIn={isLoggedIn} />

      <main className="flex-1 pt-16 md:pt-[72px]">{children}</main>

      <footer className="border-t border-gray-200 bg-gray-100 py-6">
        <div className="mx-auto w-full max-w-6xl px-4">
          <span>© {new Date().getFullYear()} MyApp. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}