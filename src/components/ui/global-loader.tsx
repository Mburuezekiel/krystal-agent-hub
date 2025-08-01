import React from 'react';
import { cn } from '@/lib/utils';

interface GlobalLoaderProps {
  isLoading: boolean;
  className?: string;
}

export const GlobalLoader: React.FC<GlobalLoaderProps> = ({ isLoading, className }) => {
  if (!isLoading) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm",
      className
    )}>
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <img 
              src="/pwa-logo-192.png" 
              alt="Krystal" 
              className="w-8 h-8 animate-pulse"
            />
          </div>
        </div>
        <div className="text-center">
          <h3 className="font-semibold text-lg text-foreground">KRYSTAL</h3>
          <p className="text-sm text-muted-foreground">Loading your experience...</p>
        </div>
      </div>
    </div>
  );
};