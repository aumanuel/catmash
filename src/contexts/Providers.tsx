"use client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { UserProvider } from './UserContext';
import { PageTransitionProvider } from './PageTransitionContext';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <PageTransitionProvider>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          {children}
        </UserProvider>
      </QueryClientProvider>
    </PageTransitionProvider>
  );
} 