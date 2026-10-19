import type { Metadata } from "next";
import "./globals.css";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { FloatingWhatsApp } from "@/components/common/FloatingWhatsApp";
import { NetlifyBadgeRemover } from "@/components/common/NetlifyBadgeRemover";

export const metadata: Metadata = {
  title: "Royal Korutla - Everything in Korutla | Local Shopping & Discovery Platform",
  description: "Discover food, groceries, clothing, services, hospitals, jobs, real estate, and exclusive offers in Korutla and nearby villages.",
  keywords: ["Korutla", "Royal Korutla", "Korutla food", "Korutla groceries", "Korutla clothing", "Korutla hospitals", "Korutla services", "Korutla directory"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-[#FAF7F2] text-[#26352D] antialiased selection:bg-[#E66A32] selection:text-white flex flex-col justify-between">
        <NetlifyBadgeRemover />
        {children}
        <FloatingWhatsApp />
        <MobileBottomNav />
      </body>
    </html>
  );
}
