"use client"
import React from 'react';
import { Utensils } from 'lucide-react';

interface LogoProps {
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({ onClick }) => {
  return (
    <div 
      className="flex items-center cursor-pointer" 
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <Utensils className="h-8 w-8 text-green-400" />
      <span className="ml-2 text-lg font-bold hidden sm:block">BytesByUs</span>
    </div>
  );
};