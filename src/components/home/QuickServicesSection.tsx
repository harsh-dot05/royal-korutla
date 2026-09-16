'use client';

import React from 'react';
import Link from 'next/link';
import { SectionHeader } from '../common/SectionHeader';
import { QUICK_SERVICE_CATEGORIES } from '../../data/mockData';
import { Zap, Droplets, Wind, Tv, Hammer, Sparkles, Car, Truck, Scissors, Monitor, Camera, Home, ArrowRight } from 'lucide-react';

export const QuickServicesSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return <Zap className="w-6 h-6 text-purple-600" />;
      case 'Droplets': return <Droplets className="w-6 h-6 text-blue-600" />;
      case 'Wind': return <Wind className="w-6 h-6 text-sky-600" />;
      case 'Tv': return <Tv className="w-6 h-6 text-amber-600" />;
      case 'Hammer': return <Hammer className="w-6 h-6 text-amber-700" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-emerald-600" />;
      case 'Car': return <Car className="w-6 h-6 text-emerald-700" />;
      case 'Truck': return <Truck className="w-6 h-6 text-orange-600" />;
      case 'Scissors': return <Scissors className="w-6 h-6 text-pink-600" />;
      case 'Monitor': return <Monitor className="w-6 h-6 text-indigo-600" />;
      case 'Camera': return <Camera className="w-6 h-6 text-rose-600" />;
      case 'Home': return <Home className="w-6 h-6 text-purple-600" />;
      default: return <WrenchIcon className="w-6 h-6 text-indigo-600" />;
    }
  };

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader
        badge="Instant Doorstep Repair"
        title="What do you need?"
        subtitle="Book trusted local repair technicians, plumbers, electricians, drivers, and home services in Korutla."
        actionText="View All Services"
        actionHref="/services"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {QUICK_SERVICE_CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={`/services?category=${encodeURIComponent(cat.slug)}`}
            className="pastel-card pastel-card-hover rounded-2xl p-4 flex flex-col items-center text-center gap-3 border border-slate-200 hover:border-purple-300 group bg-white shadow-xs"
          >
            <div className="p-3 rounded-2xl bg-purple-50 border border-purple-100 group-hover:scale-110 transition-transform">
              {getIcon(cat.iconName)}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                {cat.label}
              </h4>
              <span className="text-[10px] text-slate-500 font-semibold flex items-center justify-center gap-0.5 mt-0.5 group-hover:text-purple-700">
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

function WrenchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a2 2 0 002 2h1a2 2 0 110 4h-1a2 2 0 00-2 2v1a2 2 0 11-4 0v-1a2 2 0 00-2-2H8a2 2 0 110-4h1a2 2 0 002-2V4z" />
    </svg>
  );
}
