'use client';

import React, { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FEATURED_BUSINESSES } from '@/data/mockData';
import { Star, MapPin, Phone, MessageSquare, Clock, CheckCircle2, Sparkles, Navigation, User, Send } from 'lucide-react';

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

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment || !newName) return;
    setReviews([
      { id: `r-${Date.now()}`, name: newName, rating: newRating, comment: newComment, date: 'Just now' },
      ...reviews,
    ]);
    setNewComment('');
    setNewName('');
    alert('Thank you! Your review has been submitted on Royal Korutla 👑');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumb */}
        <div className="text-xs font-semibold text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-slate-900">Home</Link>
          <span>/</span>
          <Link href="/businesses" className="hover:text-slate-900">Businesses</Link>
          <span>/</span>
          <span className="text-indigo-600 font-bold">{business.name}</span>
        </div>

        {/* Hero Cover Card */}
        <div className="relative rounded-3xl overflow-hidden pastel-card border border-slate-200 bg-white shadow-sm">
          <div className="relative h-64 sm:h-80 w-full bg-slate-100">
            <Image
              src={business.image}
              alt={business.name}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

            <div className="absolute top-4 left-4 flex gap-2">
              {business.promotionLabel && (
                <span className="px-3 py-1 rounded-full bg-amber-500 text-white font-black text-xs flex items-center gap-1 shadow-md shadow-amber-500/20">
                  <Sparkles className="w-3.5 h-3.5 fill-white" />
                  {business.promotionLabel}
                </span>
              )}
              {business.isVerified && (
                <span className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-xs font-bold text-emerald-800 flex items-center gap-1 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Business
                </span>
              )}
            </div>
          </div>

          <div className="p-6 sm:p-8 relative -mt-16 z-10 space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold text-indigo-300 uppercase tracking-wider block mb-1">
                  {business.subCategory}
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
                  {business.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-200 flex items-center gap-1.5 mt-2">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{business.address} ({business.landmark})</span>
                </p>
              </div>

              {/* Action CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <a
                  href={`tel:${business.phone}`}
                  className="flex-1 md:flex-initial px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {business.phone}</span>
                </a>

                {business.whatsapp && (
                  <a
                    href={`https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${business.name}, I am contacting you via Royal Korutla.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 md:flex-initial px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20"
                  >
                    <MessageSquare className="w-4 h-4 fill-white" />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Grid: Info + Reviews */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="pastel-card rounded-2xl p-6 border border-slate-100 bg-white shadow-sm space-y-3">
              <h2 className="text-lg font-bold text-slate-900">About Business</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {business.description || 'Welcome to ' + business.name + '. We serve customers across Korutla town with top quality products, reasonable pricing, and exceptional service.'}
              </p>

              {business.tags && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {business.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-lg bg-indigo-50 text-xs font-semibold text-indigo-900 border border-indigo-100">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Gallery Images */}
            {business.galleryImages && business.galleryImages.length > 0 && (
              <div className="pastel-card rounded-2xl p-6 border border-slate-100 bg-white shadow-sm space-y-3">
                <h2 className="text-lg font-bold text-slate-900">Photo Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {business.galleryImages.map((img, idx) => (
                    <div key={idx} className="relative h-32 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                      <Image src={img} alt="Gallery" fill sizes="200px" className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="pastel-card rounded-2xl p-6 border border-slate-100 bg-white shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Community Reviews</h2>
                <div className="flex items-center gap-1.5 text-amber-700 font-bold text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <span>{business.rating}</span>
                  <span className="text-slate-500 text-xs font-normal">({reviews.length} reviews)</span>
                </div>
              </div>

              {/* Submit Review Form */}
              <form onSubmit={handleReviewSubmit} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Write a Review &amp; Earn 50 Royal Points 👑</h4>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-600 font-medium">Rating:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className={`p-1 ${star <= newRating ? 'text-amber-500' : 'text-slate-300'}`}
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
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                />
                <textarea
                  required
                  placeholder="Share your experience with this business..."
                  rows={2}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                />
                <button type="submit" className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm">
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Review</span>
                </button>
              </form>

              {/* Reviews List */}
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{rev.name}</span>
                      <div className="flex items-center gap-1 text-amber-700 text-xs font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        <span>{rev.rating}.0</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600">{rev.comment}</p>
                    <span className="text-[10px] text-slate-400 block">{rev.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Business Stats & Map */}
          <div className="space-y-6">
            <div className="pastel-card rounded-2xl p-6 border border-slate-100 bg-white shadow-sm space-y-4 text-xs">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Business Information</h3>

              <div className="flex items-center justify-between text-slate-700">
                <span className="text-slate-500">Timings:</span>
                <span className="text-emerald-700 font-bold">{business.timing}</span>
              </div>

              {business.ownerName && (
                <div className="flex items-center justify-between text-slate-700">
                  <span className="text-slate-500">Owner / Manager:</span>
                  <span className="font-bold text-slate-900">{business.ownerName}</span>
                </div>
              )}

              {business.priceRange && (
                <div className="flex items-center justify-between text-slate-700">
                  <span className="text-slate-500">Price Range:</span>
                  <span className="font-bold text-amber-700">{business.priceRange}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-slate-700">
                <span className="text-slate-500">Verification:</span>
                <span className="text-emerald-700 font-bold">Verified on Royal Korutla ✓</span>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="pastel-card rounded-2xl p-4 border border-slate-100 bg-white shadow-sm text-center space-y-3">
              <div className="h-36 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-slate-500">
                <Navigation className="w-8 h-8 text-indigo-600 mb-1" />
                <span className="text-xs font-semibold text-slate-800">Map &amp; Directions</span>
                <span className="text-[10px] text-slate-500 px-2">{business.address}</span>
              </div>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(business.name + ' Korutla')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-indigo-600" />
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
