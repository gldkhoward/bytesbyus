'use client';

import React from 'react';
import { GitBranch, Star, GitFork, MessageSquare, Search, User } from 'lucide-react';
import { ContentCard, type Tag, type Stats } from '@/components/common/cards/ContentCard';
import ActivityFeed from '@/components/community/activity/ActivityFeed'; 
import { Button } from '@/components/common/buttons/Button';
import { ActivityItem } from '@/components/community/activity/ActivityItem';
import { TypeWriter } from '@/components/interactive/TypeWriter';

const BytesByUsDemo = () => {
  // Sample data for content cards
  const recipeCards = [
    {
      title: "Sri Lankan Hoppers",
      description: "Traditional Sri Lankan rice flour pancakes with crispy edges and a soft center. Served with curry and sambol...",
      image: "/examples/food/hoppers.jpeg",
      tags: [
        { text: "Traditional", isPrimary: true },
        { text: "Sri Lankan", isPrimary: false }
      ],
      stats: {
        forks: 28,
        stars: 156,
        version: "v1.2"
      }
    },
    {
      title: "Prawn Curry",
      description: "Rich and aromatic prawn curry made with coconut milk, fresh spices, and tender prawns. A perfect comfort dish...",
      image: "/examples/food/prawn_curry.jpeg",
      tags: [
        { text: "Seafood", isPrimary: true },
        { text: "Curry", isPrimary: false }
      ],
      stats: {
        forks: 35,
        stars: 212,
        version: "v2.1"
      }
    },
    {
      title: "Vodka Pasta",
      description: "Creamy tomato vodka pasta with a rich sauce made from San Marzano tomatoes, heavy cream, and a touch of vodka...",
      image: "/examples/food/vodka_pasta.jpg",
      tags: [
        { text: "Italian", isPrimary: true },
        { text: "Pasta", isPrimary: false }
      ],
      stats: {
        forks: 56,
        stars: 245,
        version: "v3.0"
      }
    }
  ];

  // Sample data for activity feed
  const activities: ActivityItem[] = [
    {
      id: "1",
      type: "fork",
      username: "techie_chef",
      projectName: "Sourdough Starter Monitor",
      timestamp: "2 hours ago"
    },
    {
      id: "2",
      type: "comment",
      username: "code_kitchen",
      projectName: "API-First Recipe Platform",
      timestamp: "5 hours ago"
    }
  ];
  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      {/* Navigation */}
      <nav className="bg-lime-300 border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <span className="text-3xl" >BYTES BY US</span>
            </div>
            <div className="flex items-center space-x-6">
              <Search className="h-5 w-5 text-stone-600" />
              <User className="h-5 w-5 text-stone-600" />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-white bg-opacity-100">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="animate-float">
              <h1 className="text-4xl font-bold mb-4 text-stone-800">From Our Kitchens To Yours</h1>
              <p className="text-lg max-w-xl text-stone-700 animate-fadeIn">
                <TypeWriter 
                  text="A community-driven platform for tech enthusiasts who love to cook." 
                  delay={10}
                />
              </p>
              <div className='py-4'>
                <Button variant="default">Get Started</Button> 
              </div>            
            </div>
            <div className="relative w-full h-[300px] md:h-[400px]">
              <img
                src="/test.png"
                alt="BytesByUs Hero"
                className="object-cover rounded-lg shadow-lg w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>

     {/* Featured Content - Updated with ContentCard */}
     <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-stone-800">Trending Recipes</h2>
          <div className="flex space-x-4">
            <Button variant="outline" size="default">Latest</Button>
            <Button variant="outline" size="default">Most Forked</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipeCards.map((card, index) => (
            <ContentCard
              key={index}
              {...card}
              onStarClick={() => console.log('Star clicked')}
              onForkClick={() => console.log('Fork clicked')}
            />
          ))}
        </div>
      </div>

      {/* Community Section - Updated with ActivityFeed */}
      <div className="bg-white border-t border-stone-200 py-12 mt-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-stone-800">Community Activity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ActivityFeed activities={activities} />
            
            <div className="bg-lime-300 bg-opacity-10 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-stone-800">Join Our Community</h3>
              <p className="text-stone-600 mb-6">Connect with tech-savvy home cooks and contribute to our growing collection of recipes and guides.</p>
              <Button variant="default">Request Invite</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-stone-50 border-t border-stone-200 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4 text-stone-800">Platform</h3>
              <ul className="space-y-2 text-stone-600 text-sm">
                <li>About</li>
                <li>Features</li>
                <li>Community</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-stone-800">Categories</h3>
              <ul className="space-y-2 text-stone-600 text-sm">
                <li>Recipes</li>
                <li>Tech Guides</li>
                <li>Tutorials</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-stone-800">Resources</h3>
              <ul className="space-y-2 text-stone-600 text-sm">
                <li>Documentation</li>
                <li>API</li>
                <li>Support</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-stone-800">Legal</h3>
              <ul className="space-y-2 text-stone-600 text-sm">
                <li>Terms</li>
                <li>Privacy</li>
                <li>Guidelines</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BytesByUsDemo;