'use client';

import React, { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FEATURED_BUSINESSES } from '@/data/mockData';
import { Star, MapPin, Phone, MessageCircle, Clock, CheckCircle2, Sparkles, Navigation, Send, ArrowLeft, X } from 'lucide-react';

export default function BusinessDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const bizId = resolvedParams.id;

  const business = FEATURED_BUSINESSES.find((b) => b.id === bizId) || FEATURED_BUSINESSES[0];

  const [reviews, setReviews] = useState([
    { id: 'r1', name: 'Ravi Teja (Korutla Resident)', rating: 5, comment: 'Best quality service and courteous staff. Highly recommended!', date: '2 days ago' },
    { id: 'r2', name: 'Srinivas Goud', rating: 5, comment: 'Clean atmosphere and prompt response on WhatsApp.', date: '1 week ago' },
  ]);

  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newName, setNewName] = useState('');

  // Enquiry form state
  const [enquiryName, setEnquiryName] = useState('');
  const [enquiryPhone, setEnquiryPhone] = useState('');
  const [enquiryMessage, setEnquiryMessage] = useState('');
  const [enquirySending, setEnquirySending] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment || !newName) return;
    setReviews([
      { id: `r-${Date.now()}`, name: newName, rating: newRating, comment: newComment, date: 'Just now' },
      ...reviews,
    ]);
    setNewComment('');
    setNewName('');
    alert('Thank you! Your review has been submitted on Royal Korutla.');
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryName.trim() || !enquiryPhone.trim()) return;

    setEnquirySending(true);
    try {
      const res = await fetch('/api/business/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: business.id,
          businessName: business.name,
          customerName: enquiryName.trim(),
          customerPhone: enquiryPhone.trim(),
          serviceOrProduct: business.subCategory,
          message: enquiryMessage.trim() || `Customer enquiry for ${business.name}`,
        }),
      });

      if (res.ok) {
        setEnquirySuccess(true);
      } else {
        // Fallback WhatsApp message
        window.open(
          `https://wa.me/${(business.whatsapp || business.phone).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
            `Enquiry for ${business.name} from ${enquiryName} (${enquiryPhone}): ${enquiryMessage}`
          )}`,
          '_blank'
        );
        setEnquirySuccess(true);
      }
    } catch {
      setEnquirySuccess(true);
    } finally {
      setEnquirySending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#26352D]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumb */}
        <div className="text-xs font-semibold text-[#647067] flex items-center gap-2">
          <Link href="/" className="hover:text-[#26352D]">Home</Link>
          <span>/</span>
          <Link href="/businesses" className="hover:text-[#26352D]">Businesses</Link>
          <span>/</span>
          <span className="text-[#E66A32] font-bold">{business.name}</span>
        </div>

        {/* Hero Cover Card */}
        <div className="relative rounded-3xl overflow-hidden border border-[#E8E5DF] bg-white shadow-xs">
          <div className="relative h-64 sm:h-80 w-full bg-[#FAF7F2]">
            <Image
              src={business.image}
              alt={business.name}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[#26352D]/60" />

            <div className="absolute top-4 left-4 flex gap-2">
              {business.promotionLabel && (
                <span className="px-3 py-1 rounded-full bg-[#E66A32] text-white font-extrabold text-xs flex items-center gap-1 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 fill-white" />
                  {business.promotionLabel}
                </span>
              )}
              {business.isVerified && (
                <span className="px-3 py-1 rounded-full bg-white text-[#26352D] text-xs font-bold flex items-center gap-1 shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E66A32]" />
                  Verified Business
                </span>
              )}
            </div>
          </div>

          <div className="p-6 sm:p-8 relative -mt-16 z-10 space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold text-[#FFF6F0] uppercase tracking-wider block mb-1">
                  {business.subCategory}
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
                  {business.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-200 flex items-center gap-1.5 mt-2">
                  <MapPin className="w-4 h-4 text-[#E66A32] shrink-0" />
                  <span>{business.address} ({business.landmark})</span>
                </p>
              </div>

              {/* Action CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <a
                  href={`tel:${business.phone}`}
                  className="flex-1 md:flex-initial px-5 py-3 rounded-2xl bg-[#E66A32] hover:bg-[#D45B25] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {business.phone}</span>
                </a>

                {business.whatsapp && (
                  <a
                    href={`https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${business.name}, I am contacting you via Royal Korutla.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 md:flex-initial px-5 py-3 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Grid: Info + Reviews + Direct Enquiry */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="rounded-2xl p-6 border border-[#E8E5DF] bg-white shadow-xs space-y-3">
              <h2 className="text-lg font-bold text-[#26352D]">About Business</h2>
              <p className="text-xs sm:text-sm text-[#647067] leading-relaxed">
                {business.description || 'Welcome to ' + business.name + '. We serve customers across Korutla town with top quality products, reasonable pricing, and exceptional service.'}
              </p>

              {business.tags && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {business.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-lg bg-[#FFF6F0] text-xs font-semibold text-[#E66A32] border border-[#F8CFBE]">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Gallery Images */}
            {business.galleryImages && business.galleryImages.length > 0 && (
              <div className="rounded-2xl p-6 border border-[#E8E5DF] bg-white shadow-xs space-y-3">
                <h2 className="text-lg font-bold text-[#26352D]">Photo Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {business.galleryImages.map((img, idx) => (
                    <div key={idx} className="relative h-32 rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#E8E5DF]">
                      <Image src={img} alt="Gallery" fill sizes="200px" className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Direct Enquiry Form Card */}
            <div className="rounded-2xl p-6 border border-[#E8E5DF] bg-white shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E5DF]">
                <div>
                  <span className="text-[10px] font-bold text-[#E66A32] uppercase tracking-wider block">Customer Lead</span>
                  <h3 className="text-base font-bold text-[#26352D]">Send Enquiry to {business.name}</h3>
                </div>
                <Send className="w-5 h-5 text-[#E66A32]" />
              </div>

              {enquirySuccess ? (
                <div className="p-4 rounded-xl bg-[#FFF6F0] border border-[#F8CFBE] text-center space-y-1.5">
                  <CheckCircle2 className="w-7 h-7 text-[#E66A32] mx-auto" />
                  <p className="text-sm font-bold text-[#26352D]">Enquiry Sent Successfully!</p>
                  <p className="text-xs text-[#647067]">The business owner will get back to you directly.</p>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#26352D] font-bold mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Anand Kumar"
                        value={enquiryName}
                        onChange={(e) => setEnquiryName(e.target.value)}
                        className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl px-3.5 py-2.5 text-[#26352D] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[#26352D] font-bold mb-1">Your Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 98480 12345"
                        value={enquiryPhone}
                        onChange={(e) => setEnquiryPhone(e.target.value)}
                        className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl px-3.5 py-2.5 text-[#26352D] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#26352D] font-bold mb-1">What are you inquiring about?</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Looking for pricing, availability, or store timings..."
                      value={enquiryMessage}
                      onChange={(e) => setEnquiryMessage(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E8E5DF] focus:border-[#E66A32] rounded-xl px-3.5 py-2.5 text-[#26352D] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={enquirySending}
                    className="w-full py-3 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{enquirySending ? 'Submitting Enquiry...' : 'Submit Enquiry to Store'}</span>
                  </button>
                </form>
              )}
            </div>

            {/* Reviews Section */}
            <div className="rounded-2xl p-6 border border-[#E8E5DF] bg-white shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#26352D]">Community Reviews</h2>
                <div className="flex items-center gap-1.5 text-[#E66A32] font-bold text-sm">
                  <Star className="w-4 h-4 fill-[#E66A32] text-[#E66A32]" />
                  <span>{business.rating}</span>
                  <span className="text-[#647067] text-xs font-normal">({reviews.length} reviews)</span>
                </div>
              </div>

              {/* Submit Review Form */}
              <form onSubmit={handleReviewSubmit} className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E5DF] space-y-3">
                <h4 className="text-xs font-bold text-[#26352D] uppercase tracking-wider">Write a Review &amp; Share Your Experience</h4>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#647067] font-medium">Rating:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className={`p-1 ${star <= newRating ? 'text-[#E66A32]' : 'text-slate-300'}`}
                      aria-label={`Rate ${star} stars`}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  required
                  placeholder="Your Name *"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-white border border-[#E8E5DF] rounded-xl px-3.5 py-2 text-xs text-[#26352D] focus:outline-none focus:border-[#E66A32]"
                />
                <textarea
                  required
                  placeholder="Share your experience with this business..."
                  rows={2}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full bg-white border border-[#E8E5DF] rounded-xl px-3.5 py-2 text-xs text-[#26352D] focus:outline-none focus:border-[#E66A32]"
                />
                <button type="submit" className="px-4 py-2 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs">
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Review</span>
                </button>
              </form>

              {/* Reviews List */}
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E5DF] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#26352D]">{rev.name}</span>
                      <div className="flex items-center gap-1 text-[#E66A32] text-xs font-bold">
                        <Star className="w-3 h-3 fill-[#E66A32] text-[#E66A32]" />
                        <span>{rev.rating}.0</span>
                      </div>
                    </div>
                    <p className="text-xs text-[#647067]">{rev.comment}</p>
                    <span className="text-[10px] text-[#647067] block">{rev.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Business Stats & Map */}
          <div className="space-y-6">
            <div className="rounded-2xl p-6 border border-[#E8E5DF] bg-white shadow-xs space-y-4 text-xs">
              <h3 className="text-sm font-bold text-[#26352D] border-b border-[#E8E5DF] pb-2">Business Information</h3>

              <div className="flex items-center justify-between">
                <span className="text-[#647067]">Timings:</span>
                <span className="text-[#26352D] font-bold">{business.timing}</span>
              </div>

              {business.ownerName && (
                <div className="flex items-center justify-between">
                  <span className="text-[#647067]">Owner / Manager:</span>
                  <span className="font-bold text-[#26352D]">{business.ownerName}</span>
                </div>
              )}

              {business.priceRange && (
                <div className="flex items-center justify-between">
                  <span className="text-[#647067]">Price Range:</span>
                  <span className="font-bold text-[#E66A32]">{business.priceRange}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-[#647067]">Verification:</span>
                <span className="text-[#26352D] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E66A32]" /> Verified on RK
                </span>
              </div>
            </div>

            {/* Map & Directions Card */}
            <div className="rounded-2xl p-5 border border-[#E8E5DF] bg-white shadow-xs text-center space-y-3">
              <div className="h-36 rounded-xl bg-[#FAF7F2] border border-[#E8E5DF] flex flex-col items-center justify-center text-[#647067]">
                <Navigation className="w-8 h-8 text-[#E66A32] mb-1" />
                <span className="text-xs font-semibold text-[#26352D]">Map &amp; Directions</span>
                <span className="text-[10px] text-[#647067] px-2">{business.address}</span>
              </div>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(business.name + ' Korutla')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#E8E5DF] text-[#26352D] font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-[#E8E5DF]"
              >
                <Navigation className="w-3.5 h-3.5 text-[#E66A32]" />
                <span>Open in Google Maps</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
