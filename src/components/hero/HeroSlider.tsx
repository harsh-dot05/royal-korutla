'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight, Store, AlertCircle } from 'lucide-react';
import { HeroBannerSlide } from '@/types';

// Verified genuine default banners for immediate zero-layout-shift SSR
const FALLBACK_BANNERS: HeroBannerSlide[] = [
  {
    id: 'banner-1',
    title: 'Korutla Traditional Handlooms & Saree Market',
    subtitle: 'Discover authentic Pattu sarees, bridal lehengas, and festive menswear from renowned cloth merchants in Korutla.',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1600&auto=format&fit=crop&q=85',
    badgeText: 'CLOTH MARKET',
    badgeColor: 'bg-[#E66A32]',
    ctaText: 'Explore Clothing Stores',
    ctaLink: '/clothing',
    isActive: true,
    order: 1,
  },
  {
    id: 'banner-2',
    title: 'Fresh Vegetables, Fruits & Daily Marts',
    subtitle: 'Connect with trusted local grocery marts, fresh produce vendors, and supermarkets across Korutla town.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&auto=format&fit=crop&q=85',
    badgeText: 'DAILY ESSENTIALS',
    badgeColor: 'bg-[#E66A32]',
    ctaText: 'View Grocery Stores',
    ctaLink: '/groceries',
    isActive: true,
    order: 2,
  },
  {
    id: 'banner-3',
    title: 'Local Dining & Family Restaurants in Korutla',
    subtitle: 'Explore breakfast tiffins, authentic biryanis, and family dining options across Korutla with quick takeaway and delivery.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1600&auto=format&fit=crop&q=85',
    badgeText: 'TOWN DINING',
    badgeColor: 'bg-[#E66A32]',
    ctaText: 'Order Food Online',
    ctaLink: '/food',
    isActive: true,
    order: 3,
  },
  {
    id: 'banner-4',
    title: '24/7 Emergency Healthcare & Hospital Directory',
    subtitle: 'Emergency ambulance contacts, specialty doctor appointments, and diagnostic clinics serving Korutla and surrounding mandals.',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&auto=format&fit=crop&q=85',
    badgeText: '24/7 HEALTHCARE',
    badgeColor: 'bg-[#E66A32]',
    ctaText: 'Find Doctors & Hospitals',
    ctaLink: '/hospitals',
    isActive: true,
    order: 4,
  },
];

export const HeroSlider: React.FC = () => {
  const [banners, setBanners] = useState<HeroBannerSlide[]>(FALLBACK_BANNERS);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Fetch active hero banners from backend API on mount
  useEffect(() => {
    let isMounted = true;
    async function fetchBanners() {
      try {
        const res = await fetch('/api/hero-banners');
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0 && isMounted) {
            setBanners(json.data);
          }
        }
      } catch (err) {
        // Silently preserve verified fallback banners
      }
    }
    fetchBanners();
    return () => {
      isMounted = false;
    };
  }, []);

  // Respect user reduced-motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const totalSlides = banners.length;

  const nextSlide = useCallback(() => {
    if (totalSlides === 0) return;
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides === 0) return;
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Autoplay with calm 7-second interval; pauses on hover, focus, or reduced motion
  useEffect(() => {
    if (totalSlides <= 1 || isPaused || prefersReducedMotion) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 7000);

    return () => clearInterval(timer);
  }, [totalSlides, isPaused, prefersReducedMotion, nextSlide]);

  // Touch gesture support for mobile swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartX.current = null;
  };

  if (totalSlides === 0) return null;

  return (
    <section
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-3 sm:my-5"
      aria-label="Royal Korutla Featured Highlights"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* 
        Horizontal Banner Container:
        - Mobile: responsive 16:9 crop
        - Desktop: ~3:1 aspect ratio (max height ~380px)
        - Non-overlapping in-flow block layout
      */}
      <div
        className="relative w-full aspect-[16/9] sm:aspect-[2/1] lg:aspect-[3/1] min-h-[210px] sm:min-h-[280px] max-h-[380px] rounded-2xl overflow-hidden bg-[#26352D] border border-[#E8E5DF] shadow-md transition-shadow hover:shadow-lg"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {banners.map((slide, index) => {
          const isActive = index === currentSlide;
          const hasError = imageErrors[slide.id];

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity ${
                prefersReducedMotion ? 'duration-0' : 'duration-500 ease-out'
              } ${isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}
              aria-hidden={!isActive}
            >
              {/* Background Image with Fallback handling */}
              {!hasError ? (
                <picture>
                  {slide.mobileImage && <source media="(max-width: 640px)" srcSet={slide.mobileImage} />}
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover object-center"
                    onError={() => {
                      setImageErrors((prev) => ({ ...prev, [slide.id]: true }));
                    }}
                  />
                </picture>
              ) : (
                <div className="w-full h-full bg-[#1C2721] flex items-center justify-center p-6 text-center text-white">
                  <div className="max-w-md space-y-2">
                    <Store className="w-10 h-10 text-[#E66A32] mx-auto" />
                    <p className="text-sm font-bold">{slide.title}</p>
                    <p className="text-xs text-[#647067]">Royal Korutla Local Discovery</p>
                  </div>
                </div>
              )}

              {/* Solid High-Contrast Scrim (No Gradients, accessible contrast) */}
              <div className="absolute inset-0 bg-[#16201A]/75 sm:bg-[#16201A]/70" />

              {/* Content Block */}
              <div className="relative h-full max-w-2xl px-5 sm:px-10 lg:px-14 flex flex-col justify-center text-left">
                {/* Category/Highlight Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E66A32] text-white text-[10px] sm:text-xs font-black uppercase tracking-wider w-fit mb-2 sm:mb-3 shadow-xs">
                  <span>{slide.badgeText || 'ROYAL SPOTLIGHT'}</span>
                </div>

                {/* Banner Heading */}
                <h2 className="text-base sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug line-clamp-2 drop-shadow-xs">
                  {slide.title}
                </h2>

                {/* Banner Subtitle */}
                <p className="text-[11px] sm:text-xs lg:text-sm text-[#F0F7F3] mt-1.5 sm:mt-2.5 line-clamp-2 leading-relaxed font-medium max-w-xl">
                  {slide.subtitle}
                </p>

                {/* Destination Action Link */}
                <div className="mt-3.5 sm:mt-5">
                  <Link
                    href={slide.ctaLink || '/'}
                    className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-[#E66A32] hover:bg-[#D45B25] text-white font-extrabold text-xs sm:text-sm transition-transform active:scale-95 shadow-sm"
                  >
                    <span>{slide.ctaText || 'Learn More'}</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {/* Previous Navigation Control */}
        {totalSlides > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-xl bg-white/95 text-[#26352D] hover:text-[#E66A32] shadow-sm transition-colors border border-[#E8E5DF] focus:outline-none focus:ring-2 focus:ring-[#E66A32]"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Next Navigation Control */}
            <button
              onClick={nextSlide}
              className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-xl bg-white/95 text-[#26352D] hover:text-[#E66A32] shadow-sm transition-colors border border-[#E8E5DF] focus:outline-none focus:ring-2 focus:ring-[#E66A32]"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-[#16201A]/60 px-2.5 py-1 rounded-full border border-white/10">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 rounded-full transition-all focus:outline-none ${
                    index === currentSlide ? 'w-5 bg-[#E66A32]' : 'w-1.5 bg-white/60 hover:bg-white'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={index === currentSlide ? 'true' : 'false'}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
