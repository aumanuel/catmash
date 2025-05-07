"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ArrowUpIcon from '../../ui/ArrowUpIcon';
import { usePageTransition } from '@/contexts/PageTransitionContext';
import { useTotalMatches } from '@/hooks/useTotalMatches';

interface BottomNavigationTongueProps {
  href: string;
  label: string;
  sublabel?: string;
}

export default function BottomNavigationTongue({ href, label, sublabel }: BottomNavigationTongueProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();
  let pageTransition: ReturnType<typeof usePageTransition> | null = null;
  try {
    pageTransition = usePageTransition();
  } catch {
    pageTransition = null;
  }

  const { data: totalMatches } = useTotalMatches();

  let displaySublabel = sublabel;
  if (typeof sublabel === 'string' && /\d+/.test(sublabel)) {
    displaySublabel = sublabel.replace(/\d+/, totalMatches?.toLocaleString() ?? '...');
  } else if (!sublabel) {
    displaySublabel = totalMatches !== undefined ? `${totalMatches} matchs joués` : '...';
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!isAnimating) {
      setIsAnimating(true);
      if (pageTransition) {
        pageTransition.startTransition(href);
      } else {
        router.push(href);
      }
    }
  };

  const handleAnimationEnd = () => {};

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-[340px]">
      <button
        type="button"
        onClick={handleClick}
        onAnimationEnd={handleAnimationEnd}
        className={`w-full focus:outline-none ${isAnimating ? 'animate-slide-up' : ''}`}
        style={{ background: 'none', border: 'none', padding: 0 }}
        aria-label={label}
      >
        <div className="bg-white rounded-t-2xl shadow-lg px-8 py-4 flex flex-col items-center border border-gray-200 transition-transform duration-400 hover:scale-[1.15] cursor-pointer">
          <span className="text-2xl mb-2 text-gray-500">
            <ArrowUpIcon />
          </span>
          <span className="text-base font-semibold text-gray-800">
            {label}
          </span>
          <span className="mt-1 text-sm text-gray-500">{displaySublabel}</span>
        </div>
        <style jsx>{`
          .animate-slide-up {
            animation: slideUpTongue 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
          @keyframes slideUpTongue {
            from {
              transform: translateY(0);
            }
            to {
              transform: translateY(-100vh);
            }
          }
        `}</style>
      </button>
    </div>
  );
} 