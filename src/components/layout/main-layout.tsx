import { MainHeader } from "./main-header";
import { Footer } from "./footer";

export function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col gap-12 bg-background lg:gap-20">
            <MainHeader />
            <main className="flex flex-1 flex-col gap-12 lg:gap-20">{children}</main>
            <Footer />
        </div>
    );
}