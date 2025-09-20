
import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ className }) => {
  return (
    <div className={`bg-brand-border/50 rounded-lg animate-pulse ${className}`} role="status" aria-label="Loading content"></div>
  );
};
