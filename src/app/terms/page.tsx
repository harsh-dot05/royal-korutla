import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ShieldCheck, FileCheck, Scale, Award, Info } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions | Royal Korutla Directory Platform',
  description: 'Terms of service and platform conditions for users and local businesses on Royal Korutla.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header Title */}
        <div className="border-b border-slate-200 pb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
            <Scale className="w-4 h-4 text-blue-600" />
            <span>Platform Agreement</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Terms &amp; Conditions
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Effective Date: January 2026 • Royal Korutla Directory &amp; Rewards
          </p>
        </div>

        {/* Section List */}
        <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              1. Platform Usage & Directory Listing
            </h2>
            <p>
              Royal Korutla provides a local business, healthcare, real estate, job, and service directory for Korutla town. Business owners and service providers agree to provide truthful and accurate details regarding their shop address, contact numbers, timings, and offerings.
            </p>
          </section>

          <section className="space-y-2 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              2. Royal Points & Rewards Rules
            </h2>
            <ul className="list-disc pl-5 space-y-1 font-medium text-slate-600">
              <li>New customer accounts automatically receive 1,000 Royal Points upon registration as a welcome bonus.</li>
              <li>Royal Points maintain an exchange equivalent rate of 1,000 Points = ₹10 (1 Point = ₹0.01).</li>
              <li>Royal Points are tracked in a transaction ledger and can be redeemed for store discount vouchers.</li>
              <li>Royal Points cannot be exchanged directly for cash withdrawals or transferred outside the Royal Korutla platform.</li>
            </ul>
          </section>

          <section className="space-y-2 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-blue-600" />
              3. Verification & Content Moderation
            </h2>
            <p>
              Royal Korutla platform administrators reserve the right to verify, edit, or remove listings that contain false contact information, illegal products, or misleading promotional claims.
            </p>
          </section>

          <section className="space-y-2 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" />
              4. Limitation of Liability
            </h2>
            <p>
              Royal Korutla serves as an information and discovery platform connecting local businesses with residents. Direct transactions, service quality, and agreement negotiations between customers and listed merchants remain solely between those parties.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
