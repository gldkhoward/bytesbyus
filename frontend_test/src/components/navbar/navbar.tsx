"use client"
import React, { useState } from 'react';
import { MenuToggle } from './components/MenuToggle';
import { Logo } from './components/Logo';
import { SearchBar } from './components/SearchBar';
import { CreateButton } from './components/CreateButton';
import { NotificationBell } from './components/NotificationBell';
import { UserProfile } from './components/UserProfile';

interface NavbarProps {
  onMenuToggle: () => void;
}

export const Navbar = ({ onMenuToggle }: NavbarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    // Future functionality: trigger search results
  };
  
  const handleNotificationClick = () => {
    setActiveDropdown(activeDropdown === 'notifications' ? null : 'notifications');
    // If notifications are opened, close user profile
    if (activeDropdown === 'user') {
      setActiveDropdown('notifications');
    }
  };
  
  const handleUserProfileClick = () => {
    setActiveDropdown(activeDropdown === 'user' ? null : 'user');
    // If user profile is opened, close notifications
    if (activeDropdown === 'notifications') {
      setActiveDropdown('user');
    }
  };
  // Added this in a seperate function as the notification dropdown was behaving weirdly
  const handleScreenClick = () => {
    setActiveDropdown(null);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200" onClick={handleScreenClick}>
      <div className="flex items-center justify-between h-14 px-4 md:px-6">
        {/* Left section: Menu and Logo */}
        <div className="flex items-center space-x-4">
          <MenuToggle onToggle={onMenuToggle} />
          <Logo />
        </div>

        {/* Center section: Search bar */}
        <div className="hidden sm:block mx-4 flex-1 max-w-md">
          <SearchBar 
            value={searchQuery} 
            onChange={handleSearchChange} 
            placeholder="Search BytesByUs"
          />
        </div>

        {/* Right section: Action buttons */}
        <div className="flex items-center space-x-3">
          <CreateButton />
          <NotificationBell 
            count={3} 
            onNotificationClick={handleNotificationClick}
            isActive={activeDropdown === 'notifications'}
          />
          <UserProfile 
            onProfileClick={handleUserProfileClick}
            isActive={activeDropdown === 'user'}
          />
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="sm:hidden px-4 pb-2">
        <SearchBar 
          value={searchQuery} 
          onChange={handleSearchChange} 
          placeholder="Search BytesByUs"
        />
      </div>
    </header>
  );
};