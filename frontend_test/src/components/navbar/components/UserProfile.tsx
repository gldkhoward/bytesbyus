"use client"
import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings, User as UserIcon } from 'lucide-react';

interface UserProfileProps {
  userImage?: string;
  userName?: string;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
  isActive?: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({ 
  userImage,
  userName = 'User',
  onProfileClick,
  onSettingsClick,
  onLogoutClick,
  isActive = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Sync local state with parent's active state
  useEffect(() => {
    setIsOpen(isActive);
  }, [isActive]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Add effect to handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // Add event listener if dropdown is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    }
    setIsOpen(false);
  };

  const handleSettingsClick = () => {
    if (onSettingsClick) {
      onSettingsClick();
    }
    setIsOpen(false);
  };

  const handleLogoutClick = () => {
    if (onLogoutClick) {
      onLogoutClick();
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="p-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
        onClick={toggleDropdown}
        aria-label="User profile"
      >
        {userImage ? (
          <img 
            src={userImage} 
            alt={userName} 
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-green-400 flex items-center justify-center text-white">
            <User size={18} />
          </div>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
          <div className="py-1">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium">{userName}</p>
            </div>
            
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              onClick={handleProfileClick}
            >
              <UserIcon size={16} className="mr-2" />
              Profile
            </button>
            
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              onClick={handleSettingsClick}
            >
              <Settings size={16} className="mr-2" />
              Settings
            </button>
            
            <div className="border-t border-gray-100">
              <button
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 flex items-center"
                onClick={handleLogoutClick}
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};