// src/app/demo/ui/community/page.tsx
import React from 'react';
import ActivityFeed from '@/components/community/activity/ActivityFeed';

// Sample data for different demonstrations
const recentActivities = [
  {
    id: '1',
    type: 'fork',
    username: 'techie_chef',
    projectName: 'Sourdough Starter Monitor',
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    type: 'comment',
    username: 'code_kitchen',
    projectName: 'API-First Recipe Platform',
    timestamp: '5 hours ago'
  }
];

const allActivityTypes = [
  {
    id: '3',
    type: 'fork',
    username: 'dev_baker',
    projectName: 'Recipe API',
    timestamp: '1 hour ago'
  },
  {
    id: '4',
    type: 'comment',
    username: 'culinary_coder',
    projectName: 'Kitchen Dashboard',
    timestamp: '3 hours ago'
  },
  {
    id: '5',
    type: 'post',
    username: 'food_techie',
    projectName: 'Getting Started with Recipe APIs',
    timestamp: '4 hours ago'
  },
  {
    id: '6',
    type: 'new-member',
    username: 'chef_dev',
    projectName: '',
    timestamp: '6 hours ago'
  },
  {
    id: '7',
    type: 'star',
    username: 'kitchen_hacker',
    projectName: 'Smart Recipe Parser',
    timestamp: '8 hours ago'
  },
  {
    id: '8',
    type: 'pull-request',
    username: 'sous_dev',
    projectName: 'Recipe Database',
    timestamp: '12 hours ago'
  }
];

const longActivityList = Array(5).fill(null).map((_, index) => ({
  id: `long-${index}`,
  type: index % 2 === 0 ? 'fork' : 'comment',
  username: `user_${index}`,
  projectName: `Project ${index}`,
  timestamp: `${index + 1} hours ago`
}));

export default function CommunityComponentsDemo() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 font-sans">
      <div className="space-y-12">
        {/* Header */}
        <div className="border-b border-stone-200 pb-6">
          <h1 className="text-3xl font-bold text-stone-800">Community Components</h1>
          <p className="mt-2 text-stone-600">
            A demonstration of community components in the BytesByUs design system,
            showcasing activity feeds and other social features.
          </p>
        </div>

        {/* Basic Activity Feed */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-stone-800">Basic Activity Feed</h2>
          <div className="grid gap-4">
            <div className="p-4 border border-stone-200 rounded-lg bg-white">
              <ActivityFeed activities={recentActivities} />
            </div>
          </div>
        </section>

        {/* All Activity Types */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-stone-800">All Activity Types</h2>
          <div className="grid gap-4">
            <div className="p-4 border border-stone-200 rounded-lg bg-white">
              <h3 className="text-sm font-medium mb-4 text-stone-600">
                Showing all possible activity types: fork, comment, star, and pull-request
              </h3>
              <ActivityFeed activities={allActivityTypes} />
            </div>
          </div>
        </section>

        {/* With Custom Styling */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-stone-800">Custom Styling</h2>
          <div className="grid gap-4">
            <div className="p-4 border border-stone-200 rounded-lg">
              <ActivityFeed 
                activities={recentActivities.slice(0, 1)} 
                className="bg-stone-100 p-2 rounded-xl"
              />
            </div>
          </div>
        </section>

        {/* Longer List Example */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-stone-800">Extended Activity List</h2>
          <div className="grid gap-4">
            <div className="p-4 border border-stone-200 rounded-lg max-h-96 overflow-y-auto">
              <ActivityFeed activities={longActivityList} />
            </div>
          </div>
        </section>

        {/* Code Example */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-stone-800">Usage</h2>
          <div className="p-4 bg-stone-900 text-stone-50 rounded-lg">
            <pre className="text-sm">
{`import { ActivityFeed } from '@/components/community/ActivityFeed'

// Basic usage
const activities = [
  {
    id: '1',
    type: 'fork',
    username: 'techie_chef',
    projectName: 'Sourdough Starter Monitor',
    timestamp: '2 hours ago'
  }
]

// Render the component
<ActivityFeed activities={activities} />

// With custom className
<ActivityFeed 
  activities={activities} 
  className="bg-stone-100 p-2 rounded-xl"
/>`}
            </pre>
          </div>
        </section>

        {/* Types Documentation */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-stone-800">Type Definitions</h2>
          <div className="p-4 bg-stone-900 text-stone-50 rounded-lg">
            <pre className="text-sm">
{`// Available activity types
type ActivityType = 'fork' | 'comment' | 'star' | 'pull-request'

// Activity item interface
interface ActivityItem {
  id: string
  type: ActivityType
  username: string
  projectName: string
  timestamp: string | Date
}

// Component props
interface ActivityFeedProps {
  activities: ActivityItem[]
  className?: string
}`}
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
}