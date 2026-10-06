import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Shield, Lock, Eye, FileText, CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Royal Korutla Directory Platform',
  description: 'Privacy Policy and data protection standards for Royal Korutla local business directory and community portal.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header Title */}
        <div className="border-b border-slate-200 pb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
            <Shield className="w-4 h-4 text-blue-600" />
            <span>Data Protection & Privacy</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Last Updated: January 2026 • Royal Korutla Local Discovery Platform
          </p>
        </div>

        {/* Section List */}
        <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-600" />
              1. Information We Collect
            </h2>
            <p>
              Royal Korutla collects minimal personal information necessary to deliver local discovery services in Korutla town. This includes:
            </p>
            <ul className="list-disc pl-5 space-y-1 font-medium text-slate-600">
              <li>Name and contact phone number provided during account registration or order inquiries.</li>
              <li>Public business listing details, address, phone numbers, and images submitted by business owners.</li>
              <li>Customer reviews and ratings submitted for verified local businesses.</li>
              <li>Royal Points ledger history associated with account rewards.</li>
            </ul>
          </section>

          <section className="space-y-2 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-600" />
              2. How We Use Information
            </h2>
            <p>
              Collected information is used exclusively for:
            </p>
            <ul className="list-disc pl-5 space-y-1 font-medium text-slate-600">
              <li>Facilitating direct communication between local customers and Korutla business owners via phone or WhatsApp.</li>
              <li>Displaying accurate local business, hospital, real estate, and job listings in Korutla.</li>
              <li>Managing customer Royal Points balance, earnings, and voucher redemptions.</li>
              <li>Preventing spam, fraudulent reviews, or fake business listings.</li>
            </ul>
          </section>

          <section className="space-y-2 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              3. Data Sharing & Third Parties
            </h2>
            <p>
              Royal Korutla does not sell, rent, or trade customer or business owner personal data to third-party advertising brokers. Contact information provided on public business listings is displayed openly for public customer inquiries as requested by listing owners.
            </p>
          </section>

          <section className="space-y-2 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              4. Contact & Verification Enquiries
            </h2>
            <p>
              If you wish to update, modify, or remove your business listing or personal account information from Royal Korutla, please contact our support team through our official WhatsApp support or admin portal.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
