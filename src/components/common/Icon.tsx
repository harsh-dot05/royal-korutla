'use client';

import React from 'react';
import * as Icons from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ name, className = 'w-5 h-5', size }) => {
  const iconMap = Icons as unknown as Record<string, React.ComponentType<{ className?: string; size?: number }>>;
  const IconComponent = iconMap[name] || Icons.HelpCircle;
  return <IconComponent className={className} size={size} />;
};
