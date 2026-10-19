'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Utensils, Wrench, Briefcase, Store } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();

  // Hide on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Food', href: '/food', icon: Utensils },
    { label: 'Groceries', href: '/groceries', icon: Store },
    { label: 'Services', href: '/services', icon: Wrench },
    { label: 'Jobs', href: '/jobs', icon: Briefcase },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E8E5DF] px-2 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] shadow-lg isolate"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-md transition-colors ${
                isActive
                  ? 'text-[#E66A32] font-bold'
                  : 'text-[#647067] font-medium hover:text-[#26352D]'
              }`}
            >
              <Icon className="w-5 h-5 text-current" />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
