'use client'

import { useState } from 'react'
import {
  Heart,
  MessageCircle,
  Share2,
  GitFork,
  Star,
  MapPin,
  MoreHorizontal,
  Bookmark,
  Clock,
  ChevronRight,
  TrendingUp,
  Users,
  Utensils,
  Link
} from 'lucide-react'

interface PostAuthor {
  id: string
  name: string
  avatar: string
}

interface Recipe {
  id: string
  title: string
  timeToMake: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  image?: string
}

interface Location {
  name: string
  city: string
  type: string
}

interface Post {
  id: string
  author: PostAuthor
  content: string
  images: string[]
  timestamp: string
  type: 'recipe-share' | 'cooking-moment' | 'restaurant-visit'
  stats: {
    likes: number
    comments: number
    shares: number
  }
  recipe?: Recipe
  location?: Location
  tags: string[]
}

const dummyData: Post[] = [
  {
    id: '1',
    author: {
      id: 'user1',
      name: 'Sarah Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
    },
    content: "Finally nailed this sourdough recipe after weeks of practice! The crust is perfect and the crumb is so airy. Swipe to see the cross-section! 🍞✨ Check out the recipe I followed and my modifications in the link below.",
    images: [
      'https://images.unsplash.com/photo-1585478259715-4aa4a0116278',
      'https://images.unsplash.com/photo-1586444248902-2f64eddc13df'
    ],
    timestamp: '2h ago',
    type: 'recipe-share',
    stats: {
      likes: 1204,
      comments: 89,
      shares: 56
    },
    recipe: {
      id: 'recipe1',
      title: 'Perfect Sourdough Bread',
      timeToMake: '24h',
      difficulty: 'Medium',
      image: 'https://images.unsplash.com/photo-1585478259715-4aa4a0116278'
    },
    tags: ['baking', 'sourdough', 'homemade']
  },
  {
    id: '2',
    author: {
      id: 'user2',
      name: 'Mike Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike'
    },
    content: "Found this amazing ramen spot in the city! The broth was incredibly rich and the noodles were perfectly chewy. Definitely adding this to my favorite spots. 🍜",
    images: [
      'https://images.unsplash.com/photo-1623341214825-7f586b20e936'
    ],
    timestamp: '5h ago',
    type: 'restaurant-visit',
    stats: {
      likes: 856,
      comments: 67,
      shares: 23
    },
    location: {
      name: 'Ramen House',
      city: 'San Francisco',
      type: 'Japanese Restaurant'
    },
    tags: ['ramen', 'foodie', 'sanfrancisco']
  }
]

function SocialPost({ post }: { post: Post }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <img 
            src={post.author.avatar} 
            alt={post.author.name}
            className="w-10 h-10 rounded-full border-2 border-white ring-2 ring-green-50"
          />
          <div>
            <div className="font-medium text-gray-900">{post.author.name}</div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.timestamp}
              {post.location && (
                <>
                  <span className="mx-1">•</span>
                  <MapPin className="w-3 h-3" />
                  {post.location.name}
                </>
              )}
            </div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      

      {/* Recipe Link */}
      {post.recipe && (
        <div className="mx-4 mb-4">
          <a 
            href={`/recipe/${post.recipe.id}`}
            className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            {post.recipe.image && (
              <img 
                src={post.recipe.image} 
                alt={post.recipe.title}
                className="w-12 h-12 rounded-md object-cover"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-gray-900 truncate">
                {post.recipe.title}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.recipe.timeToMake}
                </span>
                <span className="flex items-center gap-1">
                  <Utensils className="w-3 h-3" />
                  {post.recipe.difficulty}
                </span>
              </div>
            </div>
            <Link className="w-4 h-4 text-gray-400" />
          </a>
        </div>
      )}

      {/* Images */}
      <div className="relative">
        {post.images.length === 1 ? (
          <img 
            src={post.images[0]} 
            alt=""
            className="w-full aspect-[4/3] object-cover"
          />
        ) : (
          <div className="grid grid-cols-2 gap-1">
            {post.images.map((image, index) => (
              <img 
                key={index}
                src={image} 
                alt=""
                className="w-full aspect-square object-cover"
              />
            ))}
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <button className="text-gray-500 hover:text-red-500 transition-colors">
            <Heart className="w-6 h-6" />
          </button>
          <button className="text-gray-500 hover:text-blue-500 transition-colors">
            <MessageCircle className="w-6 h-6" />
          </button>
          <button className="text-gray-500 hover:text-green-500 transition-colors">
            <Share2 className="w-6 h-6" />
          </button>
        </div>
        <button className="text-gray-500 hover:text-purple-500 transition-colors">
          <Bookmark className="w-6 h-6" />
        </button>
      </div>
      {/* Stats */}
      <div className="px-4 pb-2">
        <div className="flex items-center gap-1 text-sm font-medium">
          <span>{post.stats.likes} likes</span>
          <span className="mx-1">•</span>
          <span>{post.stats.comments} comments</span>
        </div>
      </div>

        {/* Content */}
      <div className="px-4 pb-3">
        <p className={`text-gray-600 ${!isExpanded && 'line-clamp-3'}`}>
          {post.content}
        </p>
        {post.content.length > 150 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 text-sm mt-1 hover:text-gray-600"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
      

      {/* Tags */}
      <div className="px-4 pb-4 flex flex-wrap gap-1">
        {post.tags.map(tag => (
          <span 
            key={tag}
            className="text-xs text-green-600 hover:text-green-700 cursor-pointer"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  const [feedType, setFeedType] = useState<'following' | 'trending' | 'new'>('following')

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6">
      {/* Feed Type Selector */}
      <div className="flex items-center justify-between mb-6 sticky top-[3.5rem] bg-white/80 backdrop-blur-sm z-10 py-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFeedType('following')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              feedType === 'following'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className="w-4 h-4" />
            Following
          </button>
          <button
            onClick={() => setFeedType('trending')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              feedType === 'trending'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Trending
          </button>
          <button
            onClick={() => setFeedType('new')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              feedType === 'new'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
            New
          </button>
        </div>
      </div>

      {/* Social Feed */}
      <div className="space-y-6">
        {dummyData.map(post => (
          <SocialPost key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}