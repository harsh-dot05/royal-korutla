'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FEATURED_BUSINESSES } from '@/data/mockData';
import { Promotion, PromotionType } from '@/types';
import { Sparkles, Shield, Plus, CheckCircle2, Calendar, Tag, Trash2, ArrowLeft, RefreshCw } from 'lucide-react';

export default function AdminPromotionsPage() {
  const [promotionsList, setPromotionsList] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedBizId, setSelectedBizId] = useState(FEATURED_BUSINESSES[0]?.id || '');
  const [customBizName, setCustomBizName] = useState('');
  const [promImage, setPromImage] = useState('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80');
  const [promotionType, setPromotionType] = useState<PromotionType>('HOMEPAGE_FEATURED');
  const [placement, setPlacement] = useState('Homepage Top Banner');
  const [badgeLabel, setBadgeLabel] = useState('PROMOTED');
  const [offerText, setOfferText] = useState('Special 20% Discount');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);

  const loadPromotions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/promotions');
      const data = await res.json();
      if (data.success) {
        setPromotionsList(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  const handleAddPromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetBiz = FEATURED_BUSINESSES.find((b) => b.id === selectedBizId);
    const bizName = customBizName.trim() || targetBiz?.name || 'Promoted Business';

    try {
      const res = await fetch('/api/admin/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: selectedBizId,
          businessName: bizName,
          bannerImage: promImage,
          promotionType,
          placement,
          startDate,
          endDate,
          priority: 1,
          status: 'ACTIVE',
          badgeLabel,
          offerText,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert(`Success! Promotion published for "${bizName}". Live on site in ${placement}!`);
        loadPromotions();
        setCustomBizName('');
      } else {
        alert(data.message || 'Failed to publish promotion');
      }
    } catch (err) {
      alert('Error publishing promotion');
    }
  };

  const handleDeletePromotion = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/promotions?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        loadPromotions();
      }
    } catch (err) {
      alert('Failed to remove promotion');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
          <Link href="/admin" className="hover:text-amber-400 flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Owner Control Center
          </Link>
        </div>

        {/* Header */}
        <div className="rounded-3xl p-6 sm:p-8 border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-slate-900 shadow-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Zero-Code Paid Promotion Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            Publish Business Promotion Campaigns
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl">
            When a local business pays for promotion in Korutla, select the business, set banner image &amp; dates, and publish without editing code. Active promotions display dynamically on the website and auto-hide on expiry.
          </p>
        </div>

        {/* Layout: Add Form + Active Promotions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Promotion Form */}
          <div className="rounded-2xl p-6 border border-slate-800 bg-slate-950/80 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <Plus className="w-5 h-5 text-amber-400" />
              <span>Create Paid Promotion</span>
            </h2>

            <form onSubmit={handleAddPromotion} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Select Registered Business *</label>
                <select
                  value={selectedBizId}
                  onChange={(e) => setSelectedBizId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:border-amber-500"
                >
                  {FEATURED_BUSINESSES.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.subCategory})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Or Enter Custom Business Name</label>
                <input
                  type="text"
                  placeholder="e.g. Korutla Fresh Juice Center"
                  value={customBizName}
                  onChange={(e) => setCustomBizName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Promotional Banner Image URL *</label>
                <input
                  type="url"
                  required
                  value={promImage}
                  onChange={(e) => setPromImage(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Promotion Type *</label>
                <select
                  value={promotionType}
                  onChange={(e) => setPromotionType(e.target.value as PromotionType)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:border-amber-500"
                >
                  <option value="HOMEPAGE_FEATURED">Homepage Featured</option>
                  <option value="FEATURED_BUSINESS">Featured Business Ticker</option>
                  <option value="CATEGORY_FEATURED">Category Header Spotlight</option>
                  <option value="SPONSORED_OFFER">Sponsored Deal Banner</option>
                  <option value="FESTIVAL_CAMPAIGN">Festival Campaign</option>
                  <option value="BUSINESS_OF_THE_WEEK">Business of the Week</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Badge Display Label</label>
                <input
                  type="text"
                  placeholder="e.g. PROMOTED, SPONSORED, RK FEATURED"
                  value={badgeLabel}
                  onChange={(e) => setBadgeLabel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Placement Target</label>
                <select
                  value={placement}
                  onChange={(e) => setPlacement(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:border-amber-500"
                >
                  <option value="Homepage Top Banner">Homepage Top Section</option>
                  <option value="Food Section Header">Food Category Header</option>
                  <option value="Shopping Section Header">Shopping Category Header</option>
                  <option value="Hospitals Section">Hospitals Category Header</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Offer Tagline / Highlight</label>
                <input
                  type="text"
                  placeholder="e.g. Flat 20% OFF on all purchases"
                  value={offerText}
                  onChange={(e) => setOfferText(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">End Date (Expiry)</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>Publish Promotion Live</span>
              </button>
            </form>
          </div>

          {/* Active Campaigns List */}
          <div className="lg:col-span-2 rounded-2xl p-6 border border-slate-800 bg-slate-950/80 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Current Promotional Campaigns ({promotionsList.length})</span>
              </h2>
              <button onClick={loadPromotions} className="text-xs text-amber-400 hover:underline flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading active promotions...</div>
            ) : (
              <div className="space-y-4">
                {promotionsList.map((prom) => (
                  <div
                    key={prom.id}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase">
                          {prom.badgeLabel || 'PROMOTED'}
                        </span>
                        <span className="text-[11px] font-semibold text-purple-400">{prom.placement}</span>
                      </div>

                      <h3 className="text-base font-bold text-white">{prom.businessName}</h3>
                      {prom.offerText && <p className="text-xs text-amber-300 font-semibold">{prom.offerText}</p>}
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>{prom.startDate} to {prom.endDate}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        prom.status === 'ACTIVE'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : 'bg-rose-950 text-rose-300 border-rose-800'
                      }`}>
                        {prom.status}
                      </span>
                      <button
                        onClick={() => handleDeletePromotion(prom.id)}
                        className="p-2 rounded-lg bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-xs flex items-center gap-1 shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
