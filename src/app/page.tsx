import React from 'react';
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/hero/Hero';
import { HeroSlider } from '@/components/hero/HeroSlider';
import { TodayInKorutla } from '@/components/home/TodayInKorutla';
import { FeaturedSection } from '@/components/featured/FeaturedSection';
import { PromotionsSection } from '@/components/home/PromotionsSection';
import { QuickServicesSection } from '@/components/home/QuickServicesSection';
import { FoodSpotlight } from '@/components/home/FoodSpotlight';
import { GrocerySpotlight } from '@/components/home/GrocerySpotlight';
import { JobsSpotlight } from '@/components/home/JobsSpotlight';
import { CategoryGrid } from '@/components/categories/CategoryGrid';
import { StoriesReelsSection } from '@/components/home/StoriesReelsSection';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19]">
      {/* 1. Header */}
      <Header />

      <main className="flex-1 space-y-4">
        {/* 2. Search & Hero Filter */}
        <Hero />

        {/* 3. Hero Slider Carousel */}
        <HeroSlider />

        {/* 4. Today in Korutla */}
        <TodayInKorutla />

        {/* 5. Featured Businesses ⭐ */}
        <FeaturedSection />

        {/* 6. Paid Promotions Section 🏷️ */}
        <PromotionsSection />

        {/* 7. Quick Services / "What do you need?" */}
        <QuickServicesSection />

        {/* 8. Food Spotlight */}
        <FoodSpotlight />

        {/* 9. Grocery Spotlight */}
        <GrocerySpotlight />

        {/* 10. Jobs / Work Spotlight */}
        <JobsSpotlight />

        {/* 11. Main Categories Grid */}
        <CategoryGrid />

        {/* 12. Stories / Reels */}
        <StoriesReelsSection />
      </main>

      {/* 13. Footer */}
      <Footer />
    </div>
  );
}
