'use client';

import React from 'react';
import Link from 'next/link';
import { SectionHeader } from '../common/SectionHeader';
import { QUICK_SERVICE_CATEGORIES } from '../../data/mockData';
import {
  Zap,
  Droplets,
  Wind,
  Tv,
  Hammer,
  Sparkles,
  Car,
  Truck,
  Scissors,
  Monitor,
  Camera,
  Home,
  ArrowRight,
  Wrench,
} from 'lucide-react';

export const QuickServicesSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return <Zap className="w-5 h-5 text-[#E66A32]" />;
      case 'Droplets':
        return <Droplets className="w-5 h-5 text-[#E66A32]" />;
      case 'Wind':
        return <Wind className="w-5 h-5 text-[#E66A32]" />;
      case 'Tv':
        return <Tv className="w-5 h-5 text-[#E66A32]" />;
      case 'Hammer':
        return <Hammer className="w-5 h-5 text-[#E66A32]" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-[#E66A32]" />;
      case 'Car':
        return <Car className="w-5 h-5 text-[#E66A32]" />;
      case 'Truck':
        return <Truck className="w-5 h-5 text-[#E66A32]" />;
      case 'Scissors':
        return <Scissors className="w-5 h-5 text-[#E66A32]" />;
      case 'Monitor':
        return <Monitor className="w-5 h-5 text-[#E66A32]" />;
      case 'Camera':
        return <Camera className="w-5 h-5 text-[#E66A32]" />;
      case 'Home':
        return <Home className="w-5 h-5 text-[#E66A32]" />;
      default:
        return <Wrench className="w-5 h-5 text-[#E66A32]" />;
    }
  };

  return (
    <section className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Local Home Services">
      <SectionHeader
        badge="Instant Doorstep Repair"
        title="What do you need?"
        subtitle="Book trusted local repair technicians, plumbers, electricians, drivers, and home services in Korutla."
        actionText="View All Services"
        actionHref="/services"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
        {QUICK_SERVICE_CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={`/services?category=${encodeURIComponent(cat.slug)}`}
            className="rounded-xl p-3.5 flex flex-col items-center text-center gap-2.5 border border-[#E8E5DF] hover:border-[#E66A32] group bg-white shadow-xs transition-colors"
          >
            <div className="p-2.5 rounded-lg bg-[#FFF6F0] border border-[#F8CFBE]">
              {getIcon(cat.iconName)}
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#26352D] group-hover:text-[#E66A32] transition-colors">
                {cat.label}
              </h4>
              <span className="text-[10px] text-[#647067] font-semibold flex items-center justify-center gap-0.5 mt-0.5 group-hover:text-[#E66A32]">
                <span>Book Now</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
