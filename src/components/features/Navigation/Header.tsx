import React from 'react';
import Image from 'next/image';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-50 h-[100px]">
      <div className="flex justify-center items-center w-full">
        <Image
          src="/logo.svg"
          alt="CatMash Logo"
          width={100}
          height={100}
        />
      </div>
    </header>
  );
};

export default Header; 