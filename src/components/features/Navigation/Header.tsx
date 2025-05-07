import React from 'react';
import Link from 'next/link';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-900 py-4">
      <div className="container mx-auto px-4">
        <nav className="flex justify-between items-center">
          <Link 
            href="/" 
            className="text-xl font-semibold text-white hover:text-blue-400 transition-colors"
          >
            Fast Start Web
          </Link>
          
          <div className="flex gap-6">
            <Link 
              href="/demo" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Demo
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header; 