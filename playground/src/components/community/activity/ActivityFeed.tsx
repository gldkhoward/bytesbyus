import React from 'react';
import { ActivityItem } from './ActivityItem';

// Main activity feed component

interface ActivityFeedProps {
    activities: ActivityItem[];
    className?: string;
  }
  
export const ActivityFeed = React.forwardRef<HTMLDivElement, ActivityFeedProps>(
    ({ activities, className = "" }, ref) => {
      return (
        <div ref={ref} className={`space-y-4 bg-white ${className}`}>
          {activities.map((activity) => (
            <ActivityItem key={activity.id} item={activity} />
          ))}
        </div>
      );
    }
  );
  
  ActivityFeed.displayName = "ActivityFeed";

export default ActivityFeed;