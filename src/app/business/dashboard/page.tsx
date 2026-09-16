'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FEATURED_BUSINESSES } from '@/data/mockData';
import { Store, Eye, Phone, MessageSquare, Tag, Sparkles, CheckCircle2, Edit, Plus } from 'lucide-react';

export default function BusinessDashboardPage() {
  const biz = FEATURED_BUSINESSES[0];

  const [offers, setOffers] = useState([
    { id: 'o1', title: '20% OFF Family Biryani Bucket', code: 'ROYAL20', status: 'ACTIVE' },
  ]);

  const [newOfferTitle, setNewOfferTitle] = useState('');
  const [newOfferCode, setNewOfferCode] = useState('');

  const handleAddOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfferTitle) return;
    setOffers([...offers, { id: `o-${Date.now()}`, title: newOfferTitle, code: newOfferCode || 'SPECIAL', status: 'ACTIVE' }]);
    setNewOfferTitle('');
    setNewOfferCode('');
    alert('Offer published on Royal Korutla 👑');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner */}
        <div className="rounded-3xl glass-card p-6 sm:p-8 border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-3">
                <Store className="w-3.5 h-3.5" />
                <span>Korutla Business Owner Portal</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
                {biz.name} Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-2">
                Manage your store profile, post discounts, track WhatsApp inquiries, and request paid promotion on Royal Korutla.
              </p>
            </div>

            <Link
              href={`/businesses/${biz.id}`}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 border border-slate-700"
            >
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>View Public Profile</span>
            </Link>
          </div>
        </div>

        {/* Analytics Ticker */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-semibold">Total Profile Views</span>
            <p className="text-2xl font-black text-white">3,840</p>
            <p className="text-[11px] text-emerald-400 font-semibold">+24% this month</p>
          </div>
          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-semibold">WhatsApp Leads</span>
            <p className="text-2xl font-black text-emerald-400">182</p>
            <p className="text-[11px] text-slate-400">Direct inquiries</p>
          </div>
          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-semibold">Phone Calls Received</span>
            <p className="text-2xl font-black text-indigo-400">240</p>
            <p className="text-[11px] text-slate-400">From listing button</p>
          </div>
          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-semibold">Promotion Tier</span>
            <p className="text-xl font-black text-amber-400">PROMOTED</p>
            <p className="text-[11px] text-emerald-400 font-semibold">Homepage Featured</p>
          </div>
        </div>

        {/* Management Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Offers Manager */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-amber-400" />
                <span>Store Offers &amp; Discounts</span>
              </span>
            </h2>

            <form onSubmit={handleAddOffer} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Offer Title (e.g. Flat 15% OFF on Family Meal) *"
                value={newOfferTitle}
                onChange={(e) => setNewOfferTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
              />
              <input
                type="text"
                placeholder="Promo Code (Optional e.g. FESTIVAL15)"
                value={newOfferCode}
                onChange={(e) => setNewOfferCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Publish Store Offer</span>
              </button>
            </form>

            <div className="space-y-3 pt-2">
              {offers.map((off) => (
                <div key={off.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-white">{off.title}</h4>
                    <p className="text-amber-400 font-mono text-[11px] mt-0.5">Code: {off.code}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 font-bold text-[10px]">
                    {off.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Business Profile Quick Edit */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Edit className="w-5 h-5 text-indigo-400" />
              <span>Quick Profile Settings</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Business Name</label>
                <input type="text" defaultValue={biz.name} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white" />
              </div>
              <div>
                <label className="block text-slate-400 font-medium mb-1">Phone Number</label>
                <input type="text" defaultValue={biz.phone} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white" />
              </div>
              <div>
                <label className="block text-slate-400 font-medium mb-1">WhatsApp Number</label>
                <input type="text" defaultValue={biz.whatsapp} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white" />
              </div>
              <div>
                <label className="block text-slate-400 font-medium mb-1">Operating Hours</label>
                <input type="text" defaultValue={biz.timing} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white" />
              </div>

              <button
                onClick={() => alert('Profile details updated successfully!')}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors"
              >
                Save Profile Changes
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
