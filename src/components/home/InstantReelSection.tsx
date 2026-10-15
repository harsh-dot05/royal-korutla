'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Video,
  Play,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Phone,
  Film,
  X,
  Send,
  Loader2,
  Building2,
  Globe2,
  CalendarCheck,
  TrendingUp,
} from 'lucide-react';
import { ReelPurpose } from '@/types';

const CATEGORY_OPTIONS = [
  'Food & Dining / Restaurants',
  'Clothing & Fashion Showrooms',
  'Jewellery & Gold',
  'Electronics & Mobiles',
  'Groceries & Supermarkets',
  'Health, Dental & Clinics',
  'Salons & Beauty Parlours',
  'Automobiles & Two-Wheelers',
  'Home Services & Repair',
  'Real Estate & Construction',
  'Education & Coaching',
  'Other Local Business',
];

const PURPOSE_OPTIONS: { id: ReelPurpose; label: string; description: string }[] = [
  { id: 'product_promotion', label: 'Product Promotion', description: 'Highlight a bestselling product or new stock' },
  { id: 'offer', label: 'Festive / Special Offer', description: 'Drive footfall with seasonal discounts' },
  { id: 'shop_introduction', label: 'Shop Introduction', description: 'Showcase your storefront, interior & specialties' },
  { id: 'event', label: 'Opening / Special Event', description: 'Launch events, anniversaries or festival days' },
  { id: 'other', label: 'Custom Requirement', description: 'Unique branding or custom creative reel' },
];

export const InstantReelSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [businessName, setBusinessName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [businessCategory, setBusinessCategory] = useState(CATEGORY_OPTIONS[0]);
  const [reelPurpose, setReelPurpose] = useState<ReelPurpose>('product_promotion');
  const [preferredLanguage, setPreferredLanguage] = useState<'Telugu' | 'English'>('Telugu');
  const [additionalRequirements, setAdditionalRequirements] = useState('');

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ id: string; businessName: string } | null>(null);

  const resetForm = () => {
    setBusinessName('');
    setContactPhone('');
    setBusinessCategory(CATEGORY_OPTIONS[0]);
    setReelPurpose('product_promotion');
    setPreferredLanguage('Telugu');
    setAdditionalRequirements('');
    setErrorMsg(null);
    setSuccessData(null);
  };

  const handleOpenModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!businessName.trim()) {
      setErrorMsg('Please enter your business or shop name.');
      return;
    }

    const cleanPhone = contactPhone.replace(/[\s\-\(\)]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number for callback.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/reel-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: businessName.trim(),
          contactPhone: contactPhone.trim(),
          businessCategory,
          reelPurpose,
          preferredLanguage,
          additionalRequirements: additionalRequirements.trim(),
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to submit request. Please try again.');
      }

      setSuccessData({
        id: json.data?.id || `req-${Date.now()}`,
        businessName: businessName.trim(),
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please check your connection.';
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Instant Reel Service">
      {/* Container with Warm Palette and 3D Depth */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-[#E8E5DF] shadow-md transition-shadow hover:shadow-lg">
        {/* Subtle accent top border bar */}
        <div className="h-1.5 w-full bg-[#E66A32]" />

        <div className="p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Promotion details & Value propositions */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E8E5DF] text-xs font-bold text-[#E66A32]">
                <Film className="w-3.5 h-3.5 text-[#E66A32]" />
                <span className="tracking-wide uppercase text-[11px]">Korutla Local Business Spotlight</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#26352D] tracking-tight leading-tight">
                  Instant Reel Service for Your Business
                </h2>
                <p className="text-sm sm:text-base text-[#647067] mt-2.5 leading-relaxed">
                  Put your shop, signature dishes, or new collections in front of thousands of Korutla locals. Our dedicated video team films, edits, and delivers high-engagement vertical reels tailored for Instagram and Royal Korutla.
                </p>
              </div>

              {/* Service Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8E5DF]">
                  <Clock className="w-4 h-4 text-[#E66A32] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-[#26352D]">24–48h Schedule</p>
                    <p className="text-[11px] text-[#647067]">Rapid callback &amp; shoot plan</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8E5DF]">
                  <Globe2 className="w-4 h-4 text-[#E66A32] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-[#26352D]">Telugu &amp; English</p>
                    <p className="text-[11px] text-[#647067]">Native local voiceovers</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8E5DF] col-span-2 sm:col-span-1">
                  <TrendingUp className="w-4 h-4 text-[#E66A32] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-[#26352D]">Verified Reach</p>
                    <p className="text-[11px] text-[#647067]">Featured on Korutla feed</p>
                  </div>
                </div>
              </div>

              {/* CTA and Disclaimer */}
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button
                  type="button"
                  id="request-reel-btn"
                  onClick={handleOpenModal}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white font-bold text-sm shadow-md transition-all transform active:scale-[0.98]"
                >
                  <Video className="w-4 h-4" />
                  <span>Request a Reel</span>
                </button>

                <p className="text-[11px] text-[#647067] leading-snug">
                  <span className="font-semibold text-[#26352D]">Transparent Process:</span> Request online and our coordinator will confirm your shoot schedule within 1–2 business days.
                </p>
              </div>
            </div>

            {/* Right Column: Promotional Visual with 3D Depth Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-xs sm:max-w-sm rounded-2xl bg-[#FAF7F2] border border-[#E8E5DF] p-3 shadow-md transition-transform hover:-translate-y-1 duration-300">
                
                {/* Smartphone Viewfinder Frame */}
                <div className="relative aspect-[9/14] w-full rounded-xl overflow-hidden bg-[#26352D] border border-[#E8E5DF] shadow-inner">
                  <Image
                    src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80"
                    alt="Instant Reel Production Preview"
                    fill
                    sizes="(max-width: 640px) 100vw, 400px"
                    className="object-cover opacity-90"
                  />

                  {/* Top Overlay Badge */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1C2721]/90 backdrop-blur-xs text-[10px] font-bold text-white border border-white/20">
                      <span className="w-2 h-2 rounded-full bg-[#E66A32] animate-pulse" />
                      Korutla Trending
                    </span>

                    <span className="px-2 py-0.5 rounded-md bg-[#E66A32] text-[10px] font-extrabold text-white">
                      4K REEL
                    </span>
                  </div>

                  {/* Center Play Button Graphic */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-14 h-14 rounded-full bg-white/90 text-[#E66A32] flex items-center justify-center shadow-lg border-2 border-white">
                      <Play className="w-6 h-6 fill-[#E66A32] ml-1" />
                    </div>
                  </div>

                  {/* Bottom Caption Overlay */}
                  <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-[#16201A] via-[#16201A]/80 to-transparent text-white z-10">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-extrabold text-[#E66A32]">@RoyalParadiseKorutla</span>
                      <span className="text-[10px] text-white/70">• Sponsored</span>
                    </div>
                    <p className="text-xs font-semibold line-clamp-2 text-white/95">
                      Authentic Dum Biryani, Family Seating &amp; Fast Takeaway in Korutla Town.
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-white/80 mt-2.5 pt-2 border-t border-white/15">
                      <span className="font-semibold">3.8K local views</span>
                      <span className="text-[#E66A32] font-bold">Watch Full Reel →</span>
                    </div>
                  </div>
                </div>

                {/* Floating Micro Badge */}
                <div className="absolute -bottom-3 -right-3 sm:-right-4 bg-white border border-[#E8E5DF] rounded-xl px-3 py-2 shadow-lg flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] text-[#E66A32] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[#E66A32]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#26352D]">Professional Edit</p>
                    <p className="text-[9px] text-[#647067]">Color graded &amp; scripted</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* REQUEST A REEL MODAL DIALOG */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#16201A]/80 p-4 overflow-y-auto">
          <div
            className="relative w-full max-w-lg bg-white rounded-2xl border border-[#E8E5DF] shadow-2xl overflow-hidden my-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#E8E5DF] bg-[#FAF7F2] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#E66A32] text-white flex items-center justify-center shadow-xs">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h3 id="modal-title" className="text-base font-bold text-[#26352D]">
                    Request an Instant Reel
                  </h3>
                  <p className="text-[11px] text-[#647067]">
                    Promote your Korutla business with a custom video
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1.5 rounded-lg text-[#647067] hover:text-[#26352D] hover:bg-white border border-transparent hover:border-[#E8E5DF] transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[75vh] overflow-y-auto">
              {successData ? (
                /* Success State */
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#FAF7F2] border-2 border-[#E66A32] flex items-center justify-center text-[#E66A32]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-[#26352D]">
                      Reel Request Confirmed!
                    </h4>
                    <p className="text-xs text-[#647067] mt-1 max-w-sm mx-auto">
                      Thank you, <strong className="text-[#26352D]">{successData.businessName}</strong>. Your request has been securely registered in the Royal Korutla system.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E5DF] text-left text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#647067]">Request Reference:</span>
                      <span className="font-mono font-bold text-[#26352D]">{successData.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#647067]">Expected Contact:</span>
                      <span className="font-semibold text-[#E66A32]">Within 24–48 Hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#647067]">Follow-up Method:</span>
                      <span className="font-semibold text-[#26352D]">Phone Call &amp; WhatsApp</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#647067]">
                    Our local video coordinator will call your provided number to understand your shop requirements, timing, and discuss the shoot schedule.
                  </p>

                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="w-full py-2.5 rounded-xl bg-[#26352D] hover:bg-[#1C2721] text-white text-xs font-bold transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                /* Request Form */
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  {/* Error Alert */}
                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <span className="font-medium">{errorMsg}</span>
                    </div>
                  )}

                  {/* Business Name */}
                  <div>
                    <label className="block text-[#26352D] font-bold mb-1">
                      Business / Shop Name <span className="text-[#E66A32]">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-[#647067] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="e.g., Royal Sweets & Bakery"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E8E5DF] text-[#26352D] bg-white focus:outline-none focus:border-[#E66A32] font-medium"
                      />
                    </div>
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label className="block text-[#26352D] font-bold mb-1">
                      Contact Mobile Number <span className="text-[#E66A32]">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#647067] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="e.g., +91 98480 12345"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E8E5DF] text-[#26352D] bg-white focus:outline-none focus:border-[#E66A32] font-medium"
                      />
                    </div>
                    <span className="text-[10px] text-[#647067] mt-0.5 block">
                      Our video production manager will call this number for briefing.
                    </span>
                  </div>

                  {/* Business Category */}
                  <div>
                    <label className="block text-[#26352D] font-bold mb-1">
                      Business Category <span className="text-[#E66A32]">*</span>
                    </label>
                    <select
                      value={businessCategory}
                      onChange={(e) => setBusinessCategory(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#E8E5DF] text-[#26352D] bg-white focus:outline-none focus:border-[#E66A32] font-medium"
                    >
                      {CATEGORY_OPTIONS.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Reel Purpose */}
                  <div>
                    <label className="block text-[#26352D] font-bold mb-1.5">
                      Reel Purpose <span className="text-[#E66A32]">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {PURPOSE_OPTIONS.map((opt) => {
                        const isSelected = reelPurpose === opt.id;
                        return (
                          <div
                            key={opt.id}
                            onClick={() => setReelPurpose(opt.id)}
                            className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-[#FAF7F2] border-[#E66A32] ring-1 ring-[#E66A32]'
                                : 'bg-white border-[#E8E5DF] hover:border-[#647067]'
                            }`}
                          >
                            <p className={`font-bold ${isSelected ? 'text-[#E66A32]' : 'text-[#26352D]'}`}>
                              {opt.label}
                            </p>
                            <p className="text-[10px] text-[#647067] mt-0.5 leading-tight">
                              {opt.description}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Preferred Language */}
                  <div>
                    <label className="block text-[#26352D] font-bold mb-1">
                      Preferred Language <span className="text-[#E66A32]">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPreferredLanguage('Telugu')}
                        className={`py-2 px-3 rounded-xl border font-bold text-center transition-all ${
                          preferredLanguage === 'Telugu'
                            ? 'bg-[#26352D] text-white border-[#26352D]'
                            : 'bg-white text-[#647067] border-[#E8E5DF] hover:bg-[#FAF7F2]'
                        }`}
                      >
                        Telugu (తెలుగు)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreferredLanguage('English')}
                        className={`py-2 px-3 rounded-xl border font-bold text-center transition-all ${
                          preferredLanguage === 'English'
                            ? 'bg-[#26352D] text-white border-[#26352D]'
                            : 'bg-white text-[#647067] border-[#E8E5DF] hover:bg-[#FAF7F2]'
                        }`}
                      >
                        English
                      </button>
                    </div>
                  </div>

                  {/* Additional Requirements */}
                  <div>
                    <label className="block text-[#26352D] font-bold mb-1">
                      Additional Requirements / Notes (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={additionalRequirements}
                      onChange={(e) => setAdditionalRequirements(e.target.value)}
                      placeholder="e.g., Focus on outdoor seating, special evening lights, or mention 20% discount offer code..."
                      className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF] text-[#26352D] bg-white focus:outline-none focus:border-[#E66A32] font-medium resize-none"
                    />
                  </div>

                  {/* Service Timeline Notice */}
                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E5DF] text-[11px] text-[#647067] flex items-start gap-2">
                    <CalendarCheck className="w-4 h-4 text-[#E66A32] shrink-0 mt-0.5" />
                    <span>
                      <strong>Turnaround Notice:</strong> Video shoots are scheduled based on coordinator availability, typically within 24–48 hours of initial consultation.
                    </span>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting Request to Backend...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Reel Request</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
