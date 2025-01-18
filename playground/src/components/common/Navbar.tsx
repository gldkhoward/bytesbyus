// src/components/common/navigation/Navbar.tsx
import React from 'react';
import { Search, User } from 'lucide-react';

interface NavbarProps {
  brandName: string;
  showSearch?: boolean;
  showProfile?: boolean;
  onSearchClick?: () => void;
  onProfileClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  brandName,
  showSearch = true,
  showProfile = true,
  onSearchClick,
  onProfileClick,
}) => {
  return (
    <nav className="bg-lime-300 border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <span className="text-3xl font-weight-400">{brandName}</span>
          </div>
          <div className="flex items-center space-x-6">
            {showSearch && (
              <button onClick={onSearchClick}>
                <Search className="h-5 w-5 text-stone-600" />
              </button>
            )}
            {showProfile && (
              <button onClick={onProfileClick}>
                <User className="h-5 w-5 text-stone-600" />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};