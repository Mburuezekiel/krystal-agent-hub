import { useState, createContext, useContext, ReactNode } from 'react';

interface GlobalLoaderContextType {
  isLoading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
  setLoading: (loading: boolean) => void;
}

const GlobalLoaderContext = createContext<GlobalLoaderContextType | undefined>(undefined);

export const useGlobalLoader = () => {
  const context = useContext(GlobalLoaderContext);
  if (!context) {
    throw new Error('useGlobalLoader must be used within a GlobalLoaderProvider');
  }
  return context;
};

export const useGlobalLoaderState = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCount, setLoadingCount] = useState(0);

  const showLoader = () => {
    setLoadingCount(prev => prev + 1);
    setIsLoading(true);
  };

  const hideLoader = () => {
    setLoadingCount(prev => {
      const newCount = Math.max(0, prev - 1);
      if (newCount === 0) {
        setIsLoading(false);
      }
      return newCount;
    });
  };

  const setLoading = (loading: boolean) => {
    if (loading) {
      showLoader();
    } else {
      hideLoader();
    }
  };

  return {
    isLoading,
    showLoader,
    hideLoader,
    setLoading,
  };
};

export { GlobalLoaderContext };