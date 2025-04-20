"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';

interface NotificationBellProps {
  count: number;
  onNotificationClick?: () => void;
  isActive?: boolean;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ 
  count,
  onNotificationClick,
  isActive = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Sync local state with parent's active state
  useEffect(() => {
    setIsOpen(isActive);
  }, [isActive]);
  const notificationRef = useRef<HTMLDivElement>(null);
  
  // Add effect to handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
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
  
  const handleClick = () => {
    setIsOpen(!isOpen);
    
    if (onNotificationClick) {
      onNotificationClick();
    }
  };

  return (
    <div className="relative" ref={notificationRef}>
      <button 
        className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
        onClick={handleClick}
        aria-label={`${count} notifications`}
      >
        <Bell size={20} />
        {count > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>
      
      {/* Dropdown menu for notifications - can be expanded later */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 border border-gray-200">
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">Notifications</h3>
              <button 
                className="text-sm text-green-500 hover:text-green-600"
                onClick={() => {
                  // Mark all as read functionality
                  setIsOpen(false);
                }}
              >
                Mark all as read
              </button>
            </div>
            
            {/* Placeholder for notification items */}
            <div className="py-2 text-sm text-gray-500 text-center">
              {count > 0 ? 
                `You have ${count} unread notification${count !== 1 ? 's' : ''}` : 
                'No new notifications'
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};