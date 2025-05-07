"use client";
import dynamic from "next/dynamic";
import { usePageTransition } from "@/contexts/PageTransitionContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import React from "react";

function PageTransitionOverlay() {
  const { isTransitioning, targetRoute, endTransition } = usePageTransition();
  const router = useRouter();
  const pathname = usePathname();
  const [targetPageElement, setTargetPageElement] = useState<React.ReactElement | null>(null);
  const animationRef = useRef<HTMLDivElement>(null);
  const [waitingForRoute, setWaitingForRoute] = useState(false);

  useEffect(() => {
    import("@/app/page");
    import("@/app/classement/page");
  }, []);

  useEffect(() => {
    if (isTransitioning && targetRoute) {
      if (targetRoute === "/") {
        import("@/app/page").then((mod) => setTargetPageElement(<mod.default />));
      } else if (targetRoute === "/classement") {
        import("@/app/classement/page").then((mod) => setTargetPageElement(<mod.default />));
      }
    } else {
      setTargetPageElement(null);
    }
  }, [isTransitioning, targetRoute]);

  const handleAnimationEnd = () => {
    if (isTransitioning && targetRoute) {
      setWaitingForRoute(true);
      router.push(targetRoute);
    }
  };

  useEffect(() => {
    if (waitingForRoute && isTransitioning && targetRoute) {
      const normalize = (p: string) => p.replace(/\/$/, "");
      if (normalize(pathname) === normalize(targetRoute)) {
        const timeout = setTimeout(() => {
          endTransition();
          setWaitingForRoute(false);
        }, 150);
        return () => clearTimeout(timeout);
      }
    }
  }, [pathname, waitingForRoute, isTransitioning, targetRoute, endTransition]);

  if (!isTransitioning || !targetPageElement) return null;

  return (
    <div
      ref={animationRef}
      className="fixed inset-0 z-[100] pointer-events-none"
      style={{ background: "transparent" }}
    >
      <div
        className="w-full h-full animate-slide-up-page"
        style={{ background: "inherit" }}
        onAnimationEnd={handleAnimationEnd}
      >
        {targetPageElement}
      </div>
      <style jsx global>{`
        @keyframes slideUpPage {
          from {
            transform: translateY(100vh);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up-page {
          animation: slideUpPage 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
}

export default dynamic(() => Promise.resolve(PageTransitionOverlay), { ssr: false }); 