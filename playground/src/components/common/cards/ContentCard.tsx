// src/components/common/cards/ContentCard.tsx
import React from 'react';
import { GitBranch, Star, GitFork } from 'lucide-react';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface Tag {
  text: string;
  isPrimary?: boolean;
}

export interface Stats {
  forks: number;
  stars: number;
  version: string;
}

export interface ContentCardProps {
  image?: string;
  tags: Tag[];
  title: string;
  description: string;
  stats: Stats;
  className?: string;
  link?: string;
  onStarClick?: () => void;
  onForkClick?: () => void;
}

export const ContentCard = React.forwardRef<HTMLDivElement, ContentCardProps>(
  ({ image, tags, title, description, stats, className, link, onStarClick, onForkClick, ...props }, ref) => {
    const cardContent = (
      <Card 
        ref={ref}
        className={cn(
          "overflow-hidden hover:border-primary transition-colors",
          className
        )}
        {...props}
      >
        <div className="h-48 bg-muted">
          {image && (
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <CardHeader className="p-4 pb-0">
          <div className="flex items-center space-x-2 text-sm mb-2">
            {tags.map((tag, index) => (
              <Badge 
                key={index}
                variant={tag.isPrimary ? "default" : "secondary"}
                className={cn(
                  tag.isPrimary && "bg-primary/20 text-primary-foreground hover:bg-primary/20"
                )}
              >
                {tag.text}
              </Badge>
            ))}
          </div>
          <h3 className="font-bold text-stone-800">{title}</h3>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <p className="text-muted-foreground text-sm">{description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="flex items-center justify-between w-full text-muted-foreground">
            <div className="flex items-center space-x-4"  >
              <div className="flex items-center cursor-pointer" onClick={onForkClick}>
                <GitFork className="h-4 w-4 mr-1" />
                <span className="text-sm">{stats.forks}</span>
              </div>
              <div className="flex items-center cursor-pointer" onClick={onStarClick}>
                <Star className="h-4 w-4 mr-1"  />
                <span className="text-sm">{stats.stars}</span>
              </div>
            </div>
            <div className="flex items-center">
              <GitBranch className="h-4 w-4 mr-1" />
              <span className="text-sm">{stats.version}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    );
    return cardContent;
  }
);

ContentCard.displayName = "ContentCard";