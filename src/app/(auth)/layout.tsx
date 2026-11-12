import { RedirectIfAuthenticated } from "@/components/auth/redirect-if-authenticated";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">
            <RedirectIfAuthenticated />
            {children}
        </div>
    );
}