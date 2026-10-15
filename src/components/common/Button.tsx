import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'outline' | 'ghost' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#E66A32] focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-lg';

  const variants = {
    primary: 'bg-[#E66A32] hover:bg-[#D45B25] text-white shadow-xs',
    gold: 'bg-[#E66A32] hover:bg-[#D45B25] text-white font-bold shadow-xs',
    dark: 'bg-[#26352D] hover:bg-[#1C2721] text-white font-bold shadow-xs',
    secondary: 'bg-[#F0F4F1] hover:bg-[#E3EBE5] text-[#26352D] border border-[#D2DDD6]',
    outline: 'bg-white border border-[#E8E5DF] hover:bg-[#FAF7F2] text-[#26352D]',
    ghost: 'bg-transparent hover:bg-[#FAF7F2] text-[#26352D]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
