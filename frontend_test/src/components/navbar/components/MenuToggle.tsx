"use client"
import React from 'react';
import { Menu } from 'lucide-react';

interface MenuToggleProps {
  onToggle: () => void;
}

export const MenuToggle: React.FC<MenuToggleProps> = ({ onToggle }) => {
  return (
    <button 
      onClick={onToggle}
      className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 rounded-md p-1"
      aria-label="Toggle menu"
    >
      <Menu size={24} />
    </button>
  );
};