import type { Metadata } from "next";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import QueryProvider from "@/providers/query-provider";

export const metadata: Metadata = {
  title: "بندآپ",
  description: "ساخته شده با nextjs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" className="overflow-x-clip">
      <body
        className="w-screen bg-white text-black dark:bg-gray-800 dark:text-white transition-colors font-[var(--font-roboto)] antialiased overflow-x-clip"
        style={{
          fontFamily: "Vazirmatn, sans-serif",
        }}
      >
          <QueryProvider>
              {children}
          </QueryProvider>

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