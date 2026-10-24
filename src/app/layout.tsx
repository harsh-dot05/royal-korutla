import type { Metadata } from "next";
import "./globals.css";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { FloatingWhatsApp } from "@/components/common/FloatingWhatsApp";

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
        {/* Netlify platform HUD script aborts if either canonical element exists in the DOM */}
        <div id="nl-badge-frame" className="hidden" aria-hidden="true" tabIndex={-1} />
        <div id="nl-hud-frame" className="hidden" aria-hidden="true" tabIndex={-1} />
        {children}
        <FloatingWhatsApp />
        <MobileBottomNav />
      </body>
    </html>
  );
}
