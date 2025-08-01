import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface OfflineModeProps {
  isOffline: boolean;
  onRetry?: () => void;
}

export const OfflineMode: React.FC<OfflineModeProps> = ({ isOffline, onRetry }) => {
  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-40 p-4">
      <Card className="max-w-md mx-auto bg-destructive text-destructive-foreground border-destructive">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <WifiOff className="h-5 w-5" />
            <div>
              <p className="font-semibold text-sm">You're offline</p>
              <p className="text-xs opacity-90">Check your internet connection</p>
            </div>
          </div>
          {onRetry && (
            <Button
              size="sm"
              variant="outline"
              onClick={onRetry}
              className="border-destructive-foreground/20 hover:bg-destructive-foreground/10"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export const OfflineFallback: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="max-w-md mx-auto m-4">
        <CardContent className="flex flex-col items-center text-center p-8 space-y-4">
          <WifiOff className="h-16 w-16 text-muted-foreground" />
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">You're offline</h2>
            <p className="text-muted-foreground mb-4">
              This page isn't available offline. Please check your internet connection and try again.
            </p>
          </div>
          <Button
            onClick={() => window.location.reload()}
            className="bg-primary hover:bg-primary/90"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};