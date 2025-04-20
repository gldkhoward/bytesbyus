"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSubmit?: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChange, 
  placeholder = "Search", 
  onSubmit 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(value);
    }
  };

  // Focus management
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  
  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <Search 
        className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
          isFocused ? 'text-green-400' : 'text-gray-400'
        }`} 
        size={16} 
      />
      <input 
        ref={inputRef}
        type="text" 
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`w-full h-10 pl-9 pr-4 bg-gray-100 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent ${
          isFocused ? 'border-green-400' : 'border-gray-200'
        }`}
      />
      {value && (
        <button 
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </form>
  );
};