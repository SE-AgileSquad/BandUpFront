import type { Metadata } from "next";
import localFont from "next/font/local";
import { Providers } from "@/providers/providers";
import { siteConfig } from "@/constants/site";
import "./globals.css";

const inter = localFont({
  src: [
    { path: "../../public/fonts/Inter/Inter Regular.otf", weight: "400" },
    { path: "../../public/fonts/Inter/Inter Medium.otf", weight: "500" },
    { path: "../../public/fonts/Inter/Inter SemiBold.otf", weight: "600" },
    { path: "../../public/fonts/Inter/Inter Bold.otf", weight: "700" },
    { path: "../../public/fonts/Inter/Inter ExtraBold.otf", weight: "800" },
  ],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
