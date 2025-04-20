"use client"
import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface CreateButtonProps {
  onCreateClick?: () => void;
}

export const CreateButton: React.FC<CreateButtonProps> = ({ onCreateClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = () => {
    if (onCreateClick) {
      onCreateClick();
    }
    // Default functionality could be to open a modal
  };

  return (
    <button 
      className="hidden md:flex items-center space-x-1 h-9 px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors focus:outline-none"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Create new"
    >
      <Plus size={16} className={isHovered ? 'text-green-500' : ''} />
      <span className="text-sm">Create</span>
    </button>
  );
};