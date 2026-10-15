'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { HERO_SLIDES } from '../../data/mockData';

export const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-4" aria-label="Featured Promotions">
      {/* 3:1 Aspect Ratio Banner on Desktop (~320-340px) and responsive 16:9 on mobile */}
      <div className="relative h-[210px] sm:h-[270px] md:h-[310px] lg:h-[340px] w-full rounded-xl overflow-hidden bg-[#26352D] border border-[#E8E5DF] group shadow-xs">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-300 ${
              index === currentSlide ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image */}
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, 1280px"
              className="object-cover object-center"
            />

            {/* Solid Dark Contrast Scrim (non-gradient, text-safe area) */}
            <div className="absolute inset-0 bg-[#16201A]/75" />

            {/* Content Container */}
            <div className="relative h-full max-w-2xl px-5 sm:px-10 lg:px-12 flex flex-col justify-center text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#E66A32] text-white text-[11px] sm:text-xs font-bold w-fit mb-2 sm:mb-2.5">
                <span>{slide.badgeText}</span>
              </div>

              {/* Title */}
              <h2 className="text-base sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug line-clamp-2">
                {slide.title}
              </h2>

              {/* Subtitle */}
              <p className="text-[11px] sm:text-xs lg:text-sm text-[#F0F4F1] mt-1 sm:mt-2 line-clamp-2 leading-relaxed font-normal max-w-xl">
                {slide.subtitle}
              </p>

              {/* CTA Button */}
              <div className="mt-3 sm:mt-4">
                <Link
                  href={slide.ctaLink}
                  className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-[#E66A32] hover:bg-[#D45B25] text-white font-bold text-xs sm:text-sm transition-colors shadow-xs"
                >
                  <span>{slide.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-lg bg-white/95 text-[#26352D] hover:text-[#E66A32] shadow-sm transition-colors border border-[#E8E5DF]"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-lg bg-white/95 text-[#26352D] hover:text-[#E66A32] shadow-sm transition-colors border border-[#E8E5DF]"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Dots Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === currentSlide ? 'w-5 bg-[#E66A32]' : 'w-1.5 bg-white/60 hover:bg-white'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
