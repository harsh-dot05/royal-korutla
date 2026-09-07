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
    primary: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    gold: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    rose: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    outline: 'bg-transparent text-slate-300 border-slate-700',
    slate: 'bg-slate-800/80 text-slate-300 border-slate-700/60',
  };

  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-xs font-medium',
    md: 'px-3 py-1 text-sm font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border backdrop-blur-md ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
