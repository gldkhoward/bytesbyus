'use client';

import React, { useState, useEffect } from 'react';
import { GitBranch, Star, GitFork, MessageSquare, Search, User, ChefHat, Code, Coffee } from 'lucide-react';
import { ContentCard, type Tag, type Stats } from '@/components/common/cards/ContentCard';
import ActivityFeed from '@/components/community/activity/ActivityFeed'; 
import { Button } from '@/components/common/buttons/Button';
import { ActivityItem } from '@/components/community/activity/ActivityItem';
import { TypeWriter } from '@/components/interactive/TypeWriter';

const BytesByUsDemo = () => {
  // State for animated elements
  const [isHovered, setIsHovered] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Latest');
  
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
  
  // Matrix-style food emoji rain effect
  const [rainDrops, setRainDrops] = useState<Array<{id: number, x: number, y: number, speed: number, emoji: string, delay: number}>>([]);
  
  useEffect(() => {
    const foodEmojis = ['🍕', '🍔', '🍣', '🍜', '🍩', '🍪', '🥑', '🌮', '🍗', '🥞', '🍖', '🍤', '🍙', '🍱'];
    const foodWords = ['recipe', 'cook', 'bake', 'simmer', 'roast', 'blend', 'chop', 'slice', 'dice', 'sauté', 'grill'];
    
    // Create initial rain drops
    const drops = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * -100,
      speed: 0.5 + Math.random() * 1.5,
      emoji: Math.random() > 0.7 ? foodEmojis[Math.floor(Math.random() * foodEmojis.length)] : foodWords[Math.floor(Math.random() * foodWords.length)],
      delay: Math.random() * 5
    }));
    
    setRainDrops(drops);
    
    // Animation frame for rain movement
    let animationId: number;
    let lastTime = 0;
    
    const animate = (time: number) => {
      if (time - lastTime > 50) { // Update every 50ms for performance
        lastTime = time;
        setRainDrops(prevDrops => 
          prevDrops.map(drop => {
            // Only start moving after delay
            if (drop.delay > 0) {
              return { ...drop, delay: drop.delay - 0.1 };
            }
            
            let newY = drop.y + drop.speed;
            // Reset position when it goes off screen
            if (newY > 100) {
              newY = Math.random() * -50;
              return {
                ...drop,
                y: newY,
                x: Math.random() * 100,
                speed: 0.5 + Math.random() * 1.5,
                emoji: Math.random() > 0.7 ? foodEmojis[Math.floor(Math.random() * foodEmojis.length)] : foodWords[Math.floor(Math.random() * foodWords.length)]
              };
            }
            return { ...drop, y: newY };
          })
        );
      }
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-amber-50 font-sans">
      {/* Matrix-style food emoji rain */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-20">
        {rainDrops.map(drop => (
          <div
            key={drop.id}
            className="absolute text-lime-800 font-mono"
            style={{
              left: `${drop.x}%`,
              top: `${drop.y}%`,
              transform: 'translateY(0)',
              fontSize: typeof drop.emoji === 'string' && drop.emoji.length > 1 ? '0.8rem' : '1.5rem',
              opacity: drop.y < 0 ? 0 : 0.8,
              textShadow: '0 0 5px rgba(132, 204, 22, 0.7)',
              transition: 'transform 0.5s linear'
            }}
          >
            {drop.emoji}
          </div>
        ))}
      </div>
    
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-lime-300 to-lime-400 border-b border-stone-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <ChefHat className="h-8 w-8 text-stone-700 mr-2" />
                <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-stone-800 to-lime-800">BYTES BY US</span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-lime-400 to-emerald-400 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                <button className="relative bg-white p-2 rounded-full">
                  <Search className="h-5 w-5 text-stone-600" />
                </button>
              </div>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-lime-400 to-emerald-400 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                <button className="relative bg-white p-2 rounded-full">
                  <User className="h-5 w-5 text-stone-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-white bg-opacity-90 relative overflow-hidden">
        {/* Remove floating food icons background and use the Matrix rain instead */}
        
        <div className="max-w-6xl mx-auto px-4 py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-block mb-4 px-3 py-1 bg-lime-100 rounded-full text-lime-800 font-medium text-sm">
                <div className="flex items-center">
                  <Code className="h-4 w-4 mr-1" /> 
                  <span>Code + Cuisine</span>
                </div>
              </div>
              <h1 className="text-5xl font-bold mb-4 text-stone-800 leading-tight">
                From Our <span className="text-lime-600">Kitchens</span> To Your <span className="text-lime-600">Code</span>
              </h1>
              <p className="text-lg max-w-xl text-stone-700 mb-6">
                <TypeWriter 
                  text="A community-driven platform for tech enthusiasts who love to cook. Share recipes, fork ideas, and commit to delicious innovation." 
                  delay={10}
                />
              </p>
              <div className='py-4 flex space-x-4'>
                <Button 
                  variant="default" 
                  className="group relative overflow-hidden transition-all duration-300 transform hover:scale-105"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <span className="relative z-10">Get Cooking</span>
                  {isHovered && (
                    <span className="absolute right-2 animate-bounce">🍳</span>
                  )}
                </Button> 
                <Button variant="outline" className="transition-all duration-300 transform hover:scale-105">
                  <Coffee className="h-4 w-4 mr-2" /> Explore Recipes
                </Button>
              </div>            
            </div>
            <div className="relative w-full h-[300px] md:h-[400px] transform transition-all duration-500 hover:scale-[1.02] hover:rotate-1">
              <div className="absolute -inset-1 bg-gradient-to-r from-lime-400 to-emerald-400 rounded-lg blur opacity-75"></div>
              <img
                src="/test.png"
                alt="BytesByUs Hero"
                className="relative object-cover rounded-lg shadow-lg w-full h-full"
              />
              <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-lg shadow-lg transform rotate-6">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                  <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

     {/* Featured Content - Updated with ContentCard */}
     <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-stone-800 flex items-center">
            <span className="bg-lime-200 w-10 h-10 flex items-center justify-center rounded-full mr-3">
              🔥
            </span>
            Trending Recipes
          </h2>
          <div className="flex space-x-2 bg-stone-100 p-1 rounded-lg">
            {['Latest', 'Most Forked', 'Popular'].map(category => (
              <Button 
                key={category}
                variant={activeCategory === category ? "default" : "ghost"} 
                size="sm"
                onClick={() => setActiveCategory(category)}
                className={activeCategory === category ? "shadow-md" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipeCards.map((card, index) => (
            <div 
              key={index} 
              className="transform transition-all duration-300 hover:scale-[1.03] hover:-rotate-1"
            >
              <ContentCard
                {...card}
                onStarClick={() => console.log('Star clicked')}
                onForkClick={() => console.log('Fork clicked')}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Community Section - Updated with ActivityFeed */}
      <div className="bg-white border-t border-stone-200 py-12 mt-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-lime-50 to-transparent"></div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl font-bold mb-8 text-stone-800 flex items-center">
            <span className="bg-lime-200 w-10 h-10 flex items-center justify-center rounded-full mr-3">
              👨‍💻
            </span>
            Community Activity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 border border-stone-100 transform transition-all duration-300 hover:shadow-xl">
              <ActivityFeed activities={activities} />
            </div>
            
            <div className="bg-gradient-to-br from-lime-300 to-lime-200 p-8 rounded-lg shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
              <h3 className="text-2xl font-bold mb-4 text-stone-800">Join Our Community</h3>
              <p className="text-stone-700 mb-6 relative z-10">Connect with tech-savvy home cooks and contribute to our growing collection of recipes and guides.</p>
              <Button 
                variant="default" 
                className="bg-stone-800 hover:bg-stone-900 text-white relative z-10 group overflow-hidden"
              >
                <span className="group-hover:mr-2 transition-all duration-300">Request Invite</span>
                <span className="opacity-0 group-hover:opacity-100 transition-all duration-300">🚀</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section - New */}
      <div className="bg-stone-100 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white p-6 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105">
              <div className="text-4xl font-bold text-lime-600 mb-2">5.2K+</div>
              <div className="text-stone-600">Recipes Shared</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105">
              <div className="text-4xl font-bold text-lime-600 mb-2">12K+</div>
              <div className="text-stone-600">Community Members</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105">
              <div className="text-4xl font-bold text-lime-600 mb-2">3.7K+</div>
              <div className="text-stone-600">Recipe Forks</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105">
              <div className="text-4xl font-bold text-lime-600 mb-2">98%</div>
              <div className="text-stone-600">Tasty Approval</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-stone-800 text-white py-12 mt-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <ChefHat className="h-8 w-8 text-lime-400 mr-2" />
              <span className="text-2xl font-bold">BYTES BY US</span>
            </div>
            <div className="flex space-x-4">
              <button className="bg-stone-700 hover:bg-stone-600 p-2 rounded-full transition-colors duration-300">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="bg-stone-700 hover:bg-stone-600 p-2 rounded-full transition-colors duration-300">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="bg-stone-700 hover:bg-stone-600 p-2 rounded-full transition-colors duration-300">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-stone-700 pt-8">
            <div>
              <h3 className="font-bold mb-4 text-lime-400">Platform</h3>
              <ul className="space-y-2 text-stone-300 text-sm">
                <li className="hover:text-lime-300 cursor-pointer transition-colors duration-200">About</li>
                <li className="hover:text-lime-300 cursor-pointer transition-colors duration-200">Features</li>
                <li className="hover:text-lime-300 cursor-pointer transition-colors duration-200">Community</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-lime-400">Categories</h3>
              <ul className="space-y-2 text-stone-300 text-sm">
                <li className="hover:text-lime-300 cursor-pointer transition-colors duration-200">Recipes</li>
                <li className="hover:text-lime-300 cursor-pointer transition-colors duration-200">Tech Guides</li>
                <li className="hover:text-lime-300 cursor-pointer transition-colors duration-200">Tutorials</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-lime-400">Resources</h3>
              <ul className="space-y-2 text-stone-300 text-sm">
                <li className="hover:text-lime-300 cursor-pointer transition-colors duration-200">Documentation</li>
                <li className="hover:text-lime-300 cursor-pointer transition-colors duration-200">API</li>
                <li className="hover:text-lime-300 cursor-pointer transition-colors duration-200">Support</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-lime-400">Legal</h3>
              <ul className="space-y-2 text-stone-300 text-sm">
                <li className="hover:text-lime-300 cursor-pointer transition-colors duration-200">Terms</li>
                <li className="hover:text-lime-300 cursor-pointer transition-colors duration-200">Privacy</li>
                <li className="hover:text-lime-300 cursor-pointer transition-colors duration-200">Guidelines</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-stone-700 text-center text-stone-400 text-sm">
            <p>© 2023 BytesByUs. All rights reserved. Made with 🍳 and 💻</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BytesByUsDemo;