// src/types/components/common.ts


//ContentCard.tsx
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
  }