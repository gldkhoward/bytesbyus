'use client';

import { useState, useEffect } from 'react';
import { Profile, Recipe } from '@/lib/types/database';
import Link from 'next/link';

export default function TestPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [loading, setLoading] = useState<{profile: boolean, recipes: boolean}>({
    profile: false,
    recipes: false
  });
  const [error, setError] = useState<{profile: string | null, recipes: string | null}>({
    profile: null,
    recipes: null
  });
  const [profileId, setProfileId] = useState<string>('');
  const [inputProfileId, setInputProfileId] = useState<string>('');

  // Function to fetch profile data
  const fetchProfile = async (id: string) => {
    if (!id) return;
    
    setLoading(prev => ({ ...prev, profile: true }));
    setError(prev => ({ ...prev, profile: null }));
    
    try {
      console.log(`Fetching profile with ID: ${id}`);
      
      const response = await fetch(`/api/profiles/${encodeURIComponent(id)}`);
      console.log('Profile response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Profile error response:', errorData);
        throw new Error(errorData.error || `Failed to fetch profile (${response.status})`);
      }
      
      const data = await response.json();
      console.log('Profile data received:', data);
      setProfile(data.profile);
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError(prev => ({ 
        ...prev, 
        profile: err instanceof Error ? err.message : 'An unknown error occurred'
      }));
      setProfile(null);
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  // Function to fetch user's recipes
  const fetchUserRecipes = async (id: string) => {
    if (!id) return;
    
    setLoading(prev => ({ ...prev, recipes: true }));
    setError(prev => ({ ...prev, recipes: null }));
    
    try {
      console.log(`Fetching recipes for user ID: ${id}`);
      
      const response = await fetch(`/api/profiles/${encodeURIComponent(id)}/recipes?limit=5`);
      console.log('Recipes response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Recipes error response:', errorData);
        throw new Error(errorData.error || `Failed to fetch recipes (${response.status})`);
      }
      
      const data = await response.json();
      console.log('Recipes data received:', data);
      setRecipes(data.recipes);
    } catch (err) {
      console.error('Recipes fetch error:', err);
      setError(prev => ({ 
        ...prev, 
        recipes: err instanceof Error ? err.message : 'An unknown error occurred'
      }));
      setRecipes(null);
    } finally {
      setLoading(prev => ({ ...prev, recipes: false }));
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileId(inputProfileId);
  };
  
  // Fetch profile and recipes when profileId changes
  useEffect(() => {
    if (profileId) {
      fetchProfile(profileId);
      fetchUserRecipes(profileId);
    }
  }, [profileId]);

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">API Test Home</h1>
      
      {/* API Test Navigation */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-3">API Test Pages</h2>
        <ul className="space-y-2">
          <li>
            <Link 
              href="/apitest/profiles" 
              className="inline-block bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded transition-colors"
            >
              Profiles API
            </Link>
          </li>
          {/* Add more API test links here as they are created */}
        </ul>
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Quick Profile & Recipes Test</h2>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputProfileId}
            onChange={(e) => setInputProfileId(e.target.value)}
            placeholder="Enter profile ID"
            className="flex-1 p-2 border rounded"
          />
          <button 
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Fetch Data
          </button>
        </div>
      </form>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Section */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Profile Data</h2>
          
          {loading.profile && profileId && (
            <div className="text-center p-4 bg-gray-50 rounded">
              <p>Loading profile data...</p>
            </div>
          )}
          
          {error.profile && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p><strong>Profile Error:</strong> {error.profile}</p>
            </div>
          )}
          
          {profile && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">{profile.username}'s Profile</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">User ID:</p>
                  <p className="font-mono text-sm break-all">{profile.id}</p>
                </div>
                
                {profile.avatar_url && (
                  <div className="md:col-span-2">
                    <p className="text-gray-600">Avatar:</p>
                    <img 
                      src={profile.avatar_url} 
                      alt={`${profile.username}'s avatar`}
                      className="w-20 h-20 rounded-full object-cover mt-1"
                    />
                  </div>
                )}
                
                <div className="md:col-span-2">
                  <p className="text-gray-600">Bio:</p>
                  <p>{profile.bio || 'No bio provided'}</p>
                </div>
                
                <div>
                  <p className="text-gray-600">Created:</p>
                  <p>{new Date(profile.created_at).toLocaleString()}</p>
                </div>
                
                <div>
                  <p className="text-gray-600">Last Updated:</p>
                  <p>{new Date(profile.updated_at).toLocaleString()}</p>
                </div>
                
                {profile.last_login_at && (
                  <div>
                    <p className="text-gray-600">Last Login:</p>
                    <p>{new Date(profile.last_login_at).toLocaleString()}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-gray-600">Admin Status:</p>
                  <p>{profile.is_admin ? 'Administrator' : 'Regular User'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Recipes Section */}
        <div className="md:col-span-2 mt-6">
          <h2 className="text-xl font-semibold mb-4">User Recipes</h2>
          
          {loading.recipes && profileId && (
            <div className="text-center p-4 bg-gray-50 rounded">
              <p>Loading recipe data...</p>
            </div>
          )}
          
          {error.recipes && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p><strong>Recipe Error:</strong> {error.recipes}</p>
            </div>
          )}
          
          {recipes && recipes.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {recipes.map(recipe => (
                <div key={recipe.id} className="bg-white p-4 rounded-lg shadow-md">
                  <div className="flex items-center gap-2">
                    {recipe.is_private && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Private</span>
                    )}
                    {recipe.is_verified && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Verified</span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-medium mt-2">{recipe.title}</h3>
                  
                  {recipe.image_url && (
                    <img 
                      src={recipe.image_url} 
                      alt={recipe.title}
                      className="w-full h-40 object-cover rounded mt-2"
                    />
                  )}
                  
                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                    {recipe.description || 'No description provided'}
                  </p>
                  
                  <div className="mt-3 flex flex-wrap gap-1">
                    {recipe.tags && recipe.tags.map((tag: any) => (
                      <span key={tag.id} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    {recipe.prep_time_minutes && (
                      <div>
                        <span className="text-gray-600">Prep:</span> {recipe.prep_time_minutes} min
                      </div>
                    )}
                    {recipe.cook_time_minutes && (
                      <div>
                        <span className="text-gray-600">Cook:</span> {recipe.cook_time_minutes} min
                      </div>
                    )}
                    {recipe.servings && (
                      <div>
                        <span className="text-gray-600">Serves:</span> {recipe.servings}
                      </div>
                    )}
                    {recipe.difficulty && (
                      <div>
                        <span className="text-gray-600">Difficulty:</span> {recipe.difficulty}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : recipes && recipes.length === 0 ? (
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <p className="text-gray-600">This user hasn't created any recipes yet.</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}