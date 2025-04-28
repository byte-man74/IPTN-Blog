"use client"

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { logger } from '@/lib/utils/logger';

interface SignInModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSignIn?: () => void;
}

export function SignInModal({ isOpen, onClose, onSignIn }: SignInModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn('google', { redirect: false });

      if (onSignIn) {
        onSignIn();
      }
      onClose?.();
    } catch (error) {
      logger.error('Google sign-in failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose?.()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
          <DialogDescription>
            Sign in to access your account and all features.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          <Button
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2"
          >
            <FcGoogle className="h-5 w-5" />
            <span>{isLoading ? 'Signing in...' : 'Sign in with Google'}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
