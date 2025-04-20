'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronRight, LayoutDashboard, FileText, Settings, HomeIcon, SearchIcon, HeartIcon, TrendingUpIcon, UserIcon, ClockIcon, Sticker, ShoppingCart, ShoppingBasket } from 'lucide-react'

interface SidebarItemProps {
  icon?: React.ReactNode
  label: string
  href?: string
  onClick?: () => void
  isActive?: boolean
}

interface SidebarGroupProps {
  label: string
  icon?: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  href,
  onClick,
  isActive = false,
}) => {
  const content = (
    <button
      className={cn(
        'w-full flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors',
        'hover:bg-gray-100',
        isActive && 'bg-gray-100 text-gray-900'
      )}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </button>
  )

  if (href) {
    return <a href={href}>{content}</a>
  }

  return content
}

const SidebarGroup: React.FC<SidebarGroupProps> = ({
  label,
  icon,
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-md transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span>{label}</span>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200 ease-in-out",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="pt-1 pb-2">
          {children}
        </div>
      </div>
    </div>
  )
}

interface SidebarProps {
  className?: string
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  return (
    <div className={cn('w-64 bg-white border-r h-full shadow-lg', className)}>
      <nav className="p-4 ">
        <SidebarItem label="Home" icon={<HomeIcon className="h-4 w-4" />} href="/" />
        <div className="h-px my-1" />
        <SidebarItem label="Explore" icon={<SearchIcon className="h-4 w-4" />} href="/explore" />
        <div className="h-px my-1" />
        <SidebarItem label="For You" icon={<HeartIcon className="h-4 w-4" />} href="/for-you" />
        <div className="h-px bg-gray-200 my-2" />
        <SidebarGroup
          label="Community"
        >
          <div className="space-y-1">
            <SidebarItem label="Trending" icon={<TrendingUpIcon className="h-4 w-4" />} href="/trending" />
            <SidebarItem label="New" icon={<ClockIcon className="h-4 w-4" />} href="/new" />
            <SidebarItem label="Following" icon={<UserIcon className="h-4 w-4" />} href="/following" />
          </div>
        </SidebarGroup>

        <div className="h-px bg-gray-200 my-2" />

        <SidebarGroup
          label="BytesLab"
        >
          <div className="space-y-1">
            <SidebarItem label="Pantry" icon={<ShoppingBasket className="h-4 w-4" />} href="/pantry" />
            
            <SidebarItem label="Mood Meal Finder" icon={<Sticker className="h-4 w-4" />} href="/mood-meal-finder" />

          </div>
        </SidebarGroup>

        <div className="h-px bg-gray-200 my-2" />

        <SidebarGroup
          label="Settings"
          icon={<Settings className="h-4 w-4" />}
        >
          <div className="space-y-1">
            <SidebarItem label="General" href="/settings" />
            <SidebarItem label="Security" href="/settings/security" />
            <SidebarItem label="Notifications" href="/settings/notifications" />
          </div>
        </SidebarGroup>
      </nav>
    </div>
  )
} 