import React from 'react';
import { GitBranch, Star, GitFork, Clock, User, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface Author {
  name: string;
  avatar: string;
  handle: string;
}

export interface Tag {
  text: string;
  isPrimary?: boolean;
}

export interface Metrics {
  forks: number;
  stars: number;
  version: string;
  readTime: number;
  comments: number;
}

export interface TechArticleCardProps {
  coverImage?: string;
  tags: Tag[];
  title: string;
  description: string;
  metrics: Metrics;
  author: Author;
  publishDate: string;
  className?: string;
  link?: string;
  onStarClick?: () => void;
  onForkClick?: () => void;
}

export const TechArticleCard = React.forwardRef<HTMLDivElement, TechArticleCardProps>(
  ({ 
    coverImage, 
    tags, 
    title, 
    description, 
    metrics, 
    author,
    publishDate,
    className, 
    link, 
    onStarClick, 
    onForkClick, 
    ...props 
  }, ref) => {
    const cardContent = (
      <Card 
        ref={ref}
        className={cn(
          "overflow-hidden hover:border-primary transition-colors",
          className
        )}
        {...props}
      >
        {coverImage && (
          <div className="h-48 bg-muted">
            <img 
              src={coverImage} 
              alt={title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <CardHeader className="p-4 pb-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={author.avatar} alt={author.name} />
                <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{author.name}</p>
                <p className="text-xs text-muted-foreground">@{author.handle}</p>
              </div>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-xs">{metrics.readTime} min read</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag, index) => (
              <Badge 
                key={index}
                variant={tag.isPrimary ? "default" : "secondary"}
                className={cn(
                  "text-xs",
                  tag.isPrimary && "bg-primary/20 text-primary-foreground hover:bg-primary/20"
                )}
              >
                {tag.text}
              </Badge>
            ))}
          </div>
          
          <h3 className="font-bold text-lg text-stone-800 mb-2">{title}</h3>
        </CardHeader>
        
        <CardContent className="p-4 pt-0">
          <p className="text-muted-foreground text-sm line-clamp-2">{description}</p>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <div className="flex items-center justify-between w-full text-muted-foreground">
            <div className="flex items-center space-x-4">
              <div className="flex items-center cursor-pointer" onClick={onForkClick}>
                <GitFork className="h-4 w-4 mr-1" />
                <span className="text-xs">{metrics.forks}</span>
              </div>
              <div className="flex items-center cursor-pointer" onClick={onStarClick}>
                <Star className="h-4 w-4 mr-1" />
                <span className="text-xs">{metrics.stars}</span>
              </div>
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-1" />
                <span className="text-xs">{metrics.comments}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs">{publishDate}</span>
              <div className="flex items-center">
                <GitBranch className="h-4 w-4 mr-1" />
                <span className="text-xs">{metrics.version}</span>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    );
    
    return link ? (
      <a href={link} className="block no-underline">
        {cardContent}
      </a>
    ) : cardContent;
  }
);

TechArticleCard.displayName = "TechArticleCard";