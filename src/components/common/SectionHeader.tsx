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
    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 gap-3">
      <div>
        {badge && (
          <span className="inline-block px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-[#E66A32] bg-[#FFF6F0] border border-[#F8CFBE] rounded-md mb-2">
            {badge}
          </span>
        )}
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#26352D]">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[#647067] text-xs sm:text-sm mt-1 max-w-2xl font-normal leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {actionText && actionHref && (
        <Link
          href={actionHref}
          className="self-start sm:self-auto text-xs sm:text-sm font-bold text-[#E66A32] hover:text-[#D45B25] transition-colors flex items-center gap-1"
        >
          <span>{actionText}</span>
          <span aria-hidden="true">→</span>
        </Link>
      )}

      {actionText && !actionHref && (
        <button
          onClick={onActionClick}
          className="self-start sm:self-auto text-xs sm:text-sm font-bold text-[#E66A32] hover:text-[#D45B25] transition-colors flex items-center gap-1"
        >
          <span>{actionText}</span>
          <span aria-hidden="true">→</span>
        </button>
      )}
    </div>
  );
};
