import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/app/_components/navbar";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Report",
  description: "Report of Moneybird Time Entries",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="flex min-h-screen flex-col p-5 lg:p-10 pt-20 antialiased bg-white dark:bg-slate-900 text-gray-900 dark:text-white">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
