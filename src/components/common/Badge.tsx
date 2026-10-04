import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'gold' | 'emerald' | 'rose' | 'outline' | 'slate';
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  className = '',
  size = 'sm',
}) => {
  const variantStyles = {
    primary: 'bg-blue-50 text-blue-700 border-blue-200 font-semibold',
    gold: 'bg-blue-600 text-white border-blue-600 font-bold',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
    rose: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold',
    outline: 'bg-white text-slate-700 border-slate-200 font-medium',
    slate: 'bg-slate-100 text-slate-700 border-slate-200 font-medium',
  };

  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
