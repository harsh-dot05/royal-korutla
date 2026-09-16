import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { FloatingWhatsApp } from "@/components/common/FloatingWhatsApp";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Royal Korutla - Local Discovery Platform | Food, Hospitals, Jobs & Real Estate",
  description: "Discover local food, hospitals, shopping, services, real estate, job vacancies, and exclusive store offers in Korutla town.",
  keywords: ["Korutla", "Royal Korutla", "Korutla food", "Korutla hospitals", "Korutla real estate", "Korutla local services", "Korutla directory"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-purple-500 selection:text-white flex flex-col justify-between`}>
        {children}
        <FloatingWhatsApp />
        <MobileBottomNav />
      </body>
    </html>
  );
}
