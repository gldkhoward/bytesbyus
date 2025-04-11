'use client'
import React, { useState } from 'react';
import { User, Settings, LogOut } from 'lucide-react';

interface UserMenuProps {
  username?: string;
  avatarUrl?: string;
  onLogout?: () => void;
}

export function UserMenu({ username = 'ME', avatarUrl, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        <div className="h-8 w-8 rounded-full bg-green-400 flex items-center justify-center text-white">
          {avatarUrl ? (
            <img src={avatarUrl} alt={username} className="h-full w-full rounded-full object-cover" />
          ) : (
            <User size={18} />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-100">
              {username}
            </div>
            <a
              href="#"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              <User size={16} className="mr-2" />
              Profile
            </a>
            <a
              href="#"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              <Settings size={16} className="mr-2" />
              Settings
            </a>
            <button
              onClick={onLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              <LogOut size={16} className="mr-2" />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}