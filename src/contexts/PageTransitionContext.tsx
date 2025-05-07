"use client";
import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface PageTransitionContextType {
  isTransitioning: boolean;
  targetRoute: string | null;
  startTransition: (route: string) => void;
  endTransition: () => void;
}

const PageTransitionContext = createContext<PageTransitionContextType | undefined>(undefined);

export function usePageTransition() {
  const ctx = useContext(PageTransitionContext);
  if (!ctx) throw new Error("usePageTransition must be used within a PageTransitionProvider");
  return ctx;
}

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [targetRoute, setTargetRoute] = useState<string | null>(null);

  const startTransition = useCallback((route: string) => {
    setTargetRoute(route);
    setIsTransitioning(true);
  }, []);

  const endTransition = useCallback(() => {
    setIsTransitioning(false);
    setTargetRoute(null);
  }, []);

  return (
    <PageTransitionContext.Provider value={{ isTransitioning, targetRoute, startTransition, endTransition }}>
      {children}
    </PageTransitionContext.Provider>
  );
} 