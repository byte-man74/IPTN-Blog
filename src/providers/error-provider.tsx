'use client';

import { useToast } from '@/hooks/use-toast';
import { createContext, useContext, useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import ApiCustomError from '@/types/api-custom-error';
// import * as Sentry from '@sentry/nextjs';

interface ErrorProviderProps {
  children: React.ReactNode;
  error?: Error | AxiosError | ApiCustomError | null;
}

interface ErrorContextType {
  error: Error | AxiosError | ApiCustomError | null;
  setError: (error: Error | AxiosError | ApiCustomError | null) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function useError() {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
}

export function ErrorProvider({
  children,
  error: initialError,
}: ErrorProviderProps) {
  const [error, setError] = useState<Error | AxiosError | ApiCustomError | null>(
    initialError ?? null
  );
  const { toast } = useToast();

  useEffect(() => {
    if (!error) return;

    let description = 'An unexpected error occurred';
    if (error instanceof ApiCustomError) {
        console.log("hello man", error.details)
      const responseData = error.details;
      const statusCode = error.status;

      if (statusCode === 401) {
        description =
          'You are not authorized to view this page. Please logout and login again.';
      } else if (typeof responseData === 'string') {
        description = responseData;
      }
    } else if (error instanceof AxiosError) {
      description = error.response?.data?.message || error.message || description;
    } else {
      description = error.message || description;
    }

    toast({
      variant: 'destructive',
      title: 'Error',
      description,
    });
  }, [error, toast]);

  return (
    <ErrorContext.Provider value={{ error, setError }}>
      {children}
    </ErrorContext.Provider>
  );
}
