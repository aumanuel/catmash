import Link from 'next/link';
import ArrowUpIcon from '@/components/ui/ArrowUpIcon';

interface BottomNavigationTongueProps {
  href: string;
  label: string;
  sublabel: string;
}

export default function BottomNavigationTongue({ href, label, sublabel }: BottomNavigationTongueProps) {
  return (
    <Link href={href} className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-[340px]">
      <div className="bg-white rounded-t-2xl shadow-lg px-8 py-4 flex flex-col items-center border border-gray-200 transition-transform duration-400 hover:scale-[1.15] cursor-pointer">
        <span className="text-2xl mb-2 text-gray-500">
          <ArrowUpIcon />
        </span>
        <span className="text-base font-semibold text-gray-800">
          {label}
        </span>
        <span className="mt-1 text-sm text-gray-500">{sublabel}</span>
      </div>
    </Link>
  );
} 