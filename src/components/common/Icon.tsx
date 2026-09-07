'use client';

import React from 'react';
import * as Icons from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ name, className = 'w-5 h-5', size }) => {
  // @ts-expect-error - Lucide dynamic key lookup
  const IconComponent = Icons[name] || Icons.HelpCircle;
  return <IconComponent className={className} size={size} />;
};
