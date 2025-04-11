import React from 'react';
import { LucideIcon } from 'lucide-react';

interface NavButtonProps {
  icon: LucideIcon;
  label?: string;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  badge?: number;
}

export function NavButton({
  icon: Icon,
  label,
  onClick,
  variant = 'ghost',
  size = 'default',
  className = '',
  badge
}: NavButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-400";
  const variantStyles = {
    default: "bg-green-400 text-white hover:bg-green-500",
    outline: "border border-gray-300 hover:bg-gray-100",
    ghost: "hover:bg-gray-100"
  };
  const sizeStyles = {
    default: "h-9 px-4",
    sm: "h-8 px-3",
    lg: "h-10 px-5",
    icon: "h-9 w-9"
  };
  const iconSize = size === 'lg' ? 20 : 18;

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      <Icon size={iconSize} />
      {label && <span className="ml-2">{label}</span>}
      {badge && badge > 0 && (
        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
          {badge}
        </span>
      )}
    </button>
  );
} 