import type { Metadata } from "next";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import QueryProvider from "@/providers/query-provider";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "BandUp",
  description: "BandUp is an AI-powered IELTS preparation platform that helps students improve their English language skills and achieve their desired band scores. With personalized feedback, practice exercises, and interactive lessons, BandUp provides a comprehensive learning experience for IELTS candidates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="w-screen bg-background text-foreground transition-colors font-[var(--font-roboto)] antialiased overflow-x-clip"
        style={{
          fontFamily: "Inter, sans-serif",
        }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
          </QueryProvider>
        </ThemeProvider>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          pauseOnHover={false}
          pauseOnFocusLoss={false}
          closeOnClick={false}
          draggable={true}
          stacked={true}
          rtl={true}
        />
      </body>
    </html>
  );
}
