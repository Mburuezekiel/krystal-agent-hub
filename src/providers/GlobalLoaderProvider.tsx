import React, { ReactNode } from 'react';
import { GlobalLoaderContext, useGlobalLoaderState } from '@/hooks/useGlobalLoader';
import { GlobalLoader } from '@/components/ui/global-loader';

interface GlobalLoaderProviderProps {
  children: ReactNode;
}

export const GlobalLoaderProvider: React.FC<GlobalLoaderProviderProps> = ({ children }) => {
  const loaderState = useGlobalLoaderState();

  return (
    <GlobalLoaderContext.Provider value={loaderState}>
      {children}
      <GlobalLoader isLoading={loaderState.isLoading} />
    </GlobalLoaderContext.Provider>
  );
};