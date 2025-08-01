import React from 'react';
import { cn } from '@/lib/utils';

export const ResponsiveContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn(
    "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
    className
  )}>
    {children}
  </div>
);

export const ResponsiveGrid: React.FC<{
  children: React.ReactNode;
  className?: string;
  cols?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}> = ({ children, className, cols = { sm: 1, md: 2, lg: 3, xl: 4 } }) => (
  <div className={cn(
    `grid gap-4 sm:gap-6 lg:gap-8`,
    `grid-cols-${cols.sm} sm:grid-cols-${cols.md} lg:grid-cols-${cols.lg} xl:grid-cols-${cols.xl}`,
    className
  )}>
    {children}
  </div>
);

export const ResponsiveSection: React.FC<{
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
}> = ({ children, className, padding = 'lg' }) => {
  const paddingClasses = {
    sm: 'py-8 sm:py-12',
    md: 'py-12 sm:py-16',
    lg: 'py-16 sm:py-20',
    xl: 'py-20 sm:py-24'
  };

  return (
    <section className={cn(
      paddingClasses[padding],
      className
    )}>
      {children}
    </section>
  );
};