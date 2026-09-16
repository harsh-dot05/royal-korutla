'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Utensils, Wrench, Briefcase, Crown } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Food', href: '/food', icon: Utensils, badge: 'WhatsApp' },
    { label: 'Services', href: '/services', icon: Wrench },
    { label: 'Jobs', href: '/jobs', icon: Briefcase },
    { label: 'Rewards', href: '/rewards', icon: Crown, isRoyal: true },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 relative px-3 py-1 rounded-xl transition-all ${
                isActive
                  ? item.isRoyal
                    ? 'text-amber-600 font-bold scale-105'
                    : 'text-purple-700 font-bold scale-105'
                  : 'text-slate-500 font-medium hover:text-slate-900'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive && item.isRoyal ? 'text-amber-600 fill-amber-500/20' : ''}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-3 px-1.5 py-0.2 bg-emerald-600 text-[9px] font-extrabold text-white rounded-full animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
