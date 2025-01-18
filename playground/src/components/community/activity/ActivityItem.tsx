import React from 'react';
import { GitFork, MessageSquare, Star, GitPullRequest, Newspaper, User } from 'lucide-react';

// Types for different activity actions
export type ActivityType = 'fork' | 'comment' | 'star' | 'pull-request' | 'post' | 'new-member';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  username: string;
  projectName: string;
  timestamp: string | Date;
}

interface ActivityItemProps {
  item: ActivityItem;
}


// Helper function to get the appropriate icon
const getActivityIcon = (type: ActivityType) => {
    const iconProps = { className: "h-5 w-5 text-stone-600 mt-1" };
    
    switch (type) {
      case 'fork':
        return <GitFork {...iconProps} />;
      case 'comment':
        return <MessageSquare {...iconProps} />;
      case 'star':
        return <Star {...iconProps} />;
      case 'pull-request':
        return <GitPullRequest {...iconProps} />;
      case 'post':
        return <Newspaper {...iconProps} />;
      case 'new-member':
        return <User {...iconProps} />;
    }
  };
  
  // Helper function to get activity text
  const getActivityText = (type: ActivityType, projectName: string) => {
    switch (type) {
      case 'fork':
        return `forked "${projectName}"`;
      case 'comment':
        return `commented on "${projectName}"`;
      case 'star':
        return `starred "${projectName}"`;
      case 'pull-request':
        return `opened a pull request in "${projectName}"`;
      case 'post':
        return `published a new post "${projectName}"`;
      case 'new-member':
        return `joined the community`;
    }
  };

  // Individual activity item component
export const ActivityItem = React.forwardRef<HTMLDivElement, ActivityItemProps>(
    ({ item }, ref) => {
      const { type, username, projectName, timestamp } = item;
      
      const formattedTime = typeof timestamp === 'string' 
        ? timestamp 
        : new Date(timestamp).toLocaleString();
  
      return (
        <div 
          ref={ref}
          className="flex items-start space-x-4 p-4 bg-stone-50 rounded-lg"
        >
          {getActivityIcon(type)}
          <div>
            <p className="text-sm text-stone-600">
              <span className="font-medium">@{username}</span> {getActivityText(type, projectName)}
            </p>
            <p className="text-xs text-stone-500 mt-1">{formattedTime}</p>
          </div>
        </div>
      );
    }
  );
  
  ActivityItem.displayName = "ActivityItem";