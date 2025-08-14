import React from 'react';
import { cn } from '@/lib/utils';

interface TextShimmerProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
}

export const TextShimmer: React.FC<TextShimmerProps> = ({ 
  children, 
  className,
  duration = 2 
}) => {
  return (
    <span 
      className={cn('text-shimmer', className)}
      style={{
        animationDuration: `${duration}s`
      }}
    >
      {children}
    </span>
  );
};
