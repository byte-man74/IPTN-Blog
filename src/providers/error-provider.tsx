// 'use client';

// import { useToast } from '@/hooks/use-toast';
// import { createContext, useContext, useEffect, useState } from 'react';
// import { AxiosError } from 'axios';
// import * as Sentry from '@sentry/nextjs';

// interface ErrorProviderProps {
//   children: React.ReactNode;
//   error?: Error | AxiosError | null;
// }

// interface ErrorContextType {
//   error: Error | AxiosError | null;
//   setError: (error: Error | AxiosError | null) => void;
// }

// const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

// export function useError() {
//   const context = useContext(ErrorContext);
//   if (!context) {
//     throw new Error('useError must be used within an ErrorProvider');
//   }
//   return context;
// }

// export function ErrorProvider({
//   children,
//   error: initialError,
// }: ErrorProviderProps) {
//   const [error, setError] = useState<Error | AxiosError | null>(
//     initialError ?? null
//   );
//   const { toast } = useToast();

//   useEffect(() => {
//     if (!error) return;

//     let description = 'An unexpected error occurred';

//     if (error instanceof AxiosError) {
//       const responseData = error?.response?.data;
//       const statusCode = error.response?.status;

//       // Capture specific status codes in Sentry
//       if (statusCode === 404 || statusCode === 500) {
//         Sentry.captureException(error, {
//           tags: {
//             statusCode,
//             endpoint: error.config?.url,
//           },
//           extra: {
//             responseData,
//           },
//         });
//       }

//       if (statusCode === 401) {
//         description =
//           'You are not authorized to view this page. Please logout and login again.';
//       } else if (
//         typeof responseData?.details === 'string' &&
//         responseData.details.includes('ErrorDetail')
//       ) {
//         const match = responseData.details.match(/string="([^"]+)"/);
//         description = match?.[1] ?? description;
//       } else if (
//         Array.isArray(responseData?.details) &&
//         responseData.details.length > 0
//       ) {
//         description = responseData.details[0]?.string ?? description;
//       } else {
//         description = responseData?.message || error?.message || description;
//       }
//     } else {
//       // Capture non-Axios errors in Sentry
//       Sentry.captureException(error, {
//         extra: {
//           errorMessage: error.message,
//         },
//       });
//       description = error?.message || description;
//     }

//     toast({
//       variant: 'destructive',
//       title: 'Error',
//       description,
//     });
//   }, [error, toast]);

//   return (
//     <ErrorContext.Provider value={{ error, setError }}>
//       {children}
//     </ErrorContext.Provider>
//   );
// }
