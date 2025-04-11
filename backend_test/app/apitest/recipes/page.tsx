'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ApiResponseDisplay } from '@/app/components/ApiResponseDisplay';
import { TabNavigation } from '@/app/components/TabNavigation';
import { FormInput } from '@/app/components/FormInput';

// Type for API response
interface ApiResponse {
  data: any;
  status: number;
  error: string | null;
}

// Type for recipe filters
interface RecipeFilters {
  title?: string;
  description?: string;
  difficulty?: string;
  isPrivate?: string;
  isVerified?: string;
  creatorId?: string;
  tagIds?: string;
  limit?: string;
  offset?: string;
  sortBy?: string;
  order?: string;
}

export default function RecipesApiTestPage() {
  // Active tab state
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'update' | 'delete'>('list');
  
  // Loading and error states
  const [loading, setLoading] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  
  // Form states
  const [filters, setFilters] = useState<RecipeFilters>({
    limit: '10',
    offset: '0',
    sortBy: 'created_at',
    order: 'desc'
  });
  
  const [recipeForm, setRecipeForm] = useState({
    title: '',
    description: '',
    image_url: '',
    servings: '',
    prep_time_minutes: '',
    cook_time_minutes: '',
    difficulty: 'medium',
    is_private: 'false',
    is_verified: 'false'
  });

  // Tabs configuration
  const tabs = [
    { id: 'list', label: 'List Recipes' },
    { id: 'create', label: 'Create Recipe' },
    { id: 'update', label: 'Update Recipe' },
    { id: 'delete', label: 'Delete Recipe' }
  ];

  // Handle filter changes
  const handleFilterChange = (key: keyof RecipeFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Handle recipe form changes
  const handleRecipeFormChange = (key: string, value: string) => {
    setRecipeForm(prev => ({ ...prev, [key]: value }));
  };

  // List recipes
  const listRecipes = async () => {
    setLoading(true);
    setApiResponse(null);
    
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      const response = await fetch(`/api/recipes?${queryParams.toString()}`);
      const data = await response.json();
      
      setApiResponse({
        data,
        status: response.status,
        error: !response.ok ? data.error || 'Failed to fetch recipes' : null
      });
    } catch (err) {
      setApiResponse({
        data: null,
        status: 500,
        error: err instanceof Error ? err.message : 'An unknown error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  // Create recipe
  const createRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setApiResponse(null);
    
    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...recipeForm,
          servings: parseInt(recipeForm.servings),
          prep_time_minutes: parseInt(recipeForm.prep_time_minutes),
          cook_time_minutes: parseInt(recipeForm.cook_time_minutes),
          is_private: recipeForm.is_private === 'true',
          is_verified: recipeForm.is_verified === 'true'
        }),
      });
      
      const data = await response.json();
      
      setApiResponse({
        data,
        status: response.status,
        error: !response.ok ? data.error || 'Failed to create recipe' : null
      });
    } catch (err) {
      setApiResponse({
        data: null,
        status: 500,
        error: err instanceof Error ? err.message : 'An unknown error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6">
        <Link href="/apitest" className="text-blue-500 hover:underline mb-4 inline-block">
          &larr; Back to API Test Home
        </Link>
        <h1 className="text-3xl font-bold">Recipes API Test</h1>
        <p className="text-gray-600 mt-2">
          Test the various endpoints for the Recipes API
        </p>
      </div>
      
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* List Recipes Tab */}
        {activeTab === 'list' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">GET /api/recipes</h2>
            <p className="text-gray-600 mb-4">List recipes with filters</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormInput
                label="Title"
                value={filters.title || ''}
                onChange={(value) => handleFilterChange('title', value)}
                placeholder="Filter by title"
              />
              <FormInput
                label="Description"
                value={filters.description || ''}
                onChange={(value) => handleFilterChange('description', value)}
                placeholder="Filter by description"
              />
              <FormInput
                label="Difficulty"
                value={filters.difficulty || ''}
                onChange={(value) => handleFilterChange('difficulty', value)}
                placeholder="Filter by difficulty"
              />
              <FormInput
                label="Creator ID"
                value={filters.creatorId || ''}
                onChange={(value) => handleFilterChange('creatorId', value)}
                placeholder="Filter by creator ID"
              />
              <FormInput
                label="Tag IDs"
                value={filters.tagIds || ''}
                onChange={(value) => handleFilterChange('tagIds', value)}
                placeholder="Comma-separated tag IDs"
              />
              <FormInput
                label="Limit"
                value={filters.limit || ''}
                onChange={(value) => handleFilterChange('limit', value)}
                placeholder="Number of results"
              />
              <FormInput
                label="Offset"
                value={filters.offset || ''}
                onChange={(value) => handleFilterChange('offset', value)}
                placeholder="Pagination offset"
              />
            </div>
            
            <button
              onClick={listRecipes}
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Fetch Recipes'}
            </button>
          </div>
        )}
        
        {/* Create Recipe Tab */}
        {activeTab === 'create' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">POST /api/recipes</h2>
            <p className="text-gray-600 mb-4">Create a new recipe</p>
            
            <form onSubmit={createRecipe} className="space-y-4">
              <FormInput
                label="Title"
                value={recipeForm.title}
                onChange={(value) => handleRecipeFormChange('title', value)}
                required
              />
              <FormInput
                label="Description"
                value={recipeForm.description}
                onChange={(value) => handleRecipeFormChange('description', value)}
                required
              />
              <FormInput
                label="Image URL"
                value={recipeForm.image_url}
                onChange={(value) => handleRecipeFormChange('image_url', value)}
              />
              <FormInput
                label="Servings"
                type="number"
                value={recipeForm.servings}
                onChange={(value) => handleRecipeFormChange('servings', value)}
                required
              />
              <FormInput
                label="Prep Time (minutes)"
                type="number"
                value={recipeForm.prep_time_minutes}
                onChange={(value) => handleRecipeFormChange('prep_time_minutes', value)}
                required
              />
              <FormInput
                label="Cook Time (minutes)"
                type="number"
                value={recipeForm.cook_time_minutes}
                onChange={(value) => handleRecipeFormChange('cook_time_minutes', value)}
                required
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={recipeForm.difficulty}
                    onChange={(e) => handleRecipeFormChange('difficulty', e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Private
                  </label>
                  <select
                    value={recipeForm.is_private}
                    onChange={(e) => handleRecipeFormChange('is_private', e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="false">Public</option>
                    <option value="true">Private</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Verified
                  </label>
                  <select
                    value={recipeForm.is_verified}
                    onChange={(e) => handleRecipeFormChange('is_verified', e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="false">Not Verified</option>
                    <option value="true">Verified</option>
                  </select>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Recipe'}
              </button>
            </form>
          </div>
        )}
        
        {/* Update Recipe Tab */}
        {activeTab === 'update' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">PUT /api/recipes/[id]</h2>
            <p className="text-gray-600 mb-4">Update an existing recipe</p>
            <p className="text-yellow-600 mb-4">
              Note: Update functionality will be implemented in the next iteration
            </p>
          </div>
        )}
        
        {/* Delete Recipe Tab */}
        {activeTab === 'delete' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">DELETE /api/recipes/[id]</h2>
            <p className="text-gray-600 mb-4">Delete a recipe</p>
            <p className="text-yellow-600 mb-4">
              Note: Delete functionality will be implemented in the next iteration
            </p>
          </div>
        )}
      </div>
      
      <ApiResponseDisplay
        response={apiResponse}
        onClear={() => setApiResponse(null)}
      />
    </div>
  );
} 