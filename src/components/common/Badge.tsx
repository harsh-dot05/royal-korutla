import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'orange' | 'forest' | 'gold' | 'emerald' | 'rose' | 'outline' | 'slate';
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
    primary: 'bg-[#FFF6F0] text-[#E66A32] border-[#F8CFBE] font-semibold',
    orange: 'bg-[#E66A32] text-white border-[#E66A32] font-bold',
    forest: 'bg-[#F0F4F1] text-[#26352D] border-[#D2DDD6] font-semibold',
    gold: 'bg-[#FFF6F0] text-[#E66A32] border-[#F8CFBE] font-bold',
    emerald: 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0] font-semibold',
    rose: 'bg-[#FFF1F2] text-[#BE123C] border-[#FECDD3] font-semibold',
    outline: 'bg-white text-[#26352D] border-[#E8E5DF] font-medium',
    slate: 'bg-[#FAF7F2] text-[#647067] border-[#E8E5DF] font-medium',
  };

  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
