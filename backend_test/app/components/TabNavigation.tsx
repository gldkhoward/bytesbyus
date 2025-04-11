import React from 'react';

interface Tab {
  id: string;
  label: string;
}

interface TabNavigationProps<T extends string> {
  tabs: Tab[];
  activeTab: T;
  onTabChange: (tabId: T) => void;
}

export function TabNavigation<T extends string>({ tabs, activeTab, onTabChange }: TabNavigationProps<T>) {
  return (
    <div className="mb-6">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as T)}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
} 