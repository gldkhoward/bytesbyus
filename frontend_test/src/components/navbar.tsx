"use client"
import React, { useState } from 'react';
import { Bell, Menu, Utensils, Search, Plus, User } from 'lucide-react';

interface NavbarProps {
  onMenuToggle: () => void;
}

export const Navbar = ({ onMenuToggle }: NavbarProps) => {
  const [notifications, setNotifications] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-14 px-4 md:px-6">
        {/* Left section: Menu and Logo */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={onMenuToggle}
            className="text-gray-500 hover:text-gray-700"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center">
            <Utensils className="h-8 w-8 text-green-400" />
            <span className="ml-2 text-lg font-bold hidden sm:block">BytesByUs</span>
          </div>
        </div>

        {/* Center section: Search bar */}
        <div className="hidden sm:block mx-4 flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search BytesByUs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 bg-gray-100 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right section: Action buttons */}
        <div className="flex items-center space-x-3">
          {/* Create Button */}
          <button className="hidden md:flex items-center space-x-1 h-9 px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors">
            <Plus size={16} />
            <span className="text-sm">Create</span>
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Bell size={20} />
            {notifications > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>

          {/* User Profile */}
          <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
            <div className="h-8 w-8 rounded-full bg-green-400 flex items-center justify-center text-white">
              <User size={18} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="sm:hidden px-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search BytesByUs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 bg-gray-100 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
          />
        </div>
      </div>
    </header>
  );
};