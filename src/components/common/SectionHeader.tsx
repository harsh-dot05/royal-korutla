import React from 'react';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  actionText?: string;
  onActionClick?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  title,
  subtitle,
  actionText,
  onActionClick,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
      <div>
        {badge && (
          <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full mb-2">
            {badge}
          </span>
        )}
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="text-slate-400 text-sm sm:text-base mt-1.5 max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>

      {actionText && (
        <button
          onClick={onActionClick}
          className="self-start sm:self-auto text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 group"
        >
          {actionText}
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      )}
    </div>
  );
};
