'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FEATURED_BUSINESSES } from '@/data/mockData';
import { Promotion, PromotionType } from '@/types';
import { Sparkles, Plus, Calendar, Trash2, ArrowLeft, RefreshCw } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
          <Link href="/admin" className="hover:text-blue-600 flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Owner Control Center
          </Link>
        </div>

        {/* Header */}
        <div className="rounded-2xl p-6 sm:p-8 border border-slate-200 bg-white shadow-xs space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Zero-Code Paid Promotion Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Publish Business Promotion Campaigns
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-normal">
            When a local business pays for promotion in Korutla, select the business, set banner image &amp; dates, and publish without editing code. Active promotions display dynamically on the website and auto-hide on expiry.
          </p>
        </div>

        {/* Layout: Add Form + Active Promotions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Promotion Form */}
          <div className="rounded-2xl p-6 border border-slate-200 bg-white shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <Plus className="w-5 h-5 text-blue-600" />
              <span>Create Paid Promotion</span>
            </h2>

            <form onSubmit={handleAddPromotion} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Registered Business *</label>
                <select
                  value={selectedBizId}
                  onChange={(e) => setSelectedBizId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                >
                  {FEATURED_BUSINESSES.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.subCategory})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Or Enter Custom Business Name</label>
                <input
                  type="text"
                  placeholder="e.g. Korutla Fresh Juice Center"
                  value={customBizName}
                  onChange={(e) => setCustomBizName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Promotional Banner Image URL *</label>
                <input
                  type="url"
                  required
                  value={promImage}
                  onChange={(e) => setPromImage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Promotion Type *</label>
                <select
                  value={promotionType}
                  onChange={(e) => setPromotionType(e.target.value as PromotionType)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-blue-600"
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
                <label className="block font-bold text-slate-700 mb-1">Badge Display Label</label>
                <input
                  type="text"
                  placeholder="e.g. PROMOTED, SPONSORED, RK FEATURED"
                  value={badgeLabel}
                  onChange={(e) => setBadgeLabel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Placement Target</label>
                <select
                  value={placement}
                  onChange={(e) => setPlacement(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                >
                  <option value="Homepage Top Banner">Homepage Top Section</option>
                  <option value="Food Section Header">Food Category Header</option>
                  <option value="Shopping Section Header">Shopping Category Header</option>
                  <option value="Hospitals Section">Hospitals Category Header</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Offer Tagline / Highlight</label>
                <input
                  type="text"
                  placeholder="e.g. Flat 20% OFF on all purchases"
                  value={offerText}
                  onChange={(e) => setOfferText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">End Date (Expiry)</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-white text-white" />
                <span>Publish Promotion Live</span>
              </button>
            </form>
          </div>

          {/* Active Campaigns List */}
          <div className="lg:col-span-2 rounded-2xl p-6 border border-slate-200 bg-white shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Current Promotional Campaigns ({promotionsList.length})</span>
              </h2>
              <button onClick={loadPromotions} className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs font-medium text-slate-500">Loading active promotions...</div>
            ) : (
              <div className="space-y-4">
                {promotionsList.map((prom) => (
                  <div
                    key={prom.id}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-blue-600 text-white font-bold text-[10px] uppercase">
                          {prom.badgeLabel || 'PROMOTED'}
                        </span>
                        <span className="text-[11px] font-bold text-blue-600">{prom.placement}</span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900">{prom.businessName}</h3>
                      {prom.offerText && <p className="text-xs text-blue-600 font-bold">{prom.offerText}</p>}
                      <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{prom.startDate} to {prom.endDate}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                        prom.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {prom.status}
                      </span>
                      <button
                        onClick={() => handleDeletePromotion(prom.id)}
                        className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1 shrink-0 transition-colors"
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
