import React from 'react';
import Link from 'next/link';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  actionText?: string;
  actionHref?: string;
  onActionClick?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  title,
  subtitle,
  actionText,
  actionHref,
  onActionClick,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
      <div>
        {badge && (
          <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100 border border-purple-200 rounded-full mb-2 shadow-2xs">
            {badge}
          </span>
        )}
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          {title}
        </h2>
        {subtitle && (
          <p className="text-slate-600 text-sm sm:text-base mt-1 max-w-2xl font-normal leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {actionText && actionHref && (
        <Link
          href={actionHref}
          className="self-start sm:self-auto text-sm font-bold text-purple-700 hover:text-purple-900 transition-colors flex items-center gap-1 group"
        >
          {actionText}
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      )}

      {actionText && !actionHref && (
        <button
          onClick={onActionClick}
          className="self-start sm:self-auto text-sm font-bold text-purple-700 hover:text-purple-900 transition-colors flex items-center gap-1 group"
        >
          {actionText}
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      )}
    </div>
  );
};
