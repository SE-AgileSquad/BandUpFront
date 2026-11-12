import { ThemeToggle } from "@/components/layout/theme-toggle";
import { MobileBand, WelcomePanel, type PanelMascot } from "./welcome-panel";

type AuthShellProps = {
    headline?: string;
    description?: string;
    mascot?: PanelMascot;
    children: React.ReactNode;
};

export function AuthShell({
    headline,
    description,
    mascot,
    children,
}: AuthShellProps) {
    return (
        <div className="flex min-h-screen flex-col lg:flex-row">
            <MobileBand mascot={mascot} />
            <WelcomePanel headline={headline} description={description} mascot={mascot} />
            <div className="relative flex flex-1 flex-col lg:items-center lg:justify-center lg:px-6">
                <div className="absolute top-6 right-6 hidden lg:block">
                    <ThemeToggle />
                </div>
                <div className="mx-auto flex w-full flex-col gap-[14px] px-6 py-[22px] md:max-w-md lg:w-[420px] lg:max-w-full lg:gap-[18px] lg:px-0 lg:py-12">
                    {children}
                </div>
            </div>
        </div>
    );
}