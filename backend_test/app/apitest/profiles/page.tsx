'use client';

import { useState, useEffect } from 'react';
import { Profile, Recipe } from '@/lib/types/database';
import Link from 'next/link';

// Type for profile update form data
interface ProfileUpdateFormData {
  username: string;
  bio: string;
}

// Type for API response data
interface ApiResponse {
  data: any;
  status: number;
  error: string | null;
}

export default function ProfilesApiTestPage() {
  // Active tab state
  const [activeTab, setActiveTab] = useState<'get' | 'update' | 'avatar' | 'recipes' | 'stars'>('get');

  // Profile ID input state
  const [profileId, setProfileId] = useState<string>('');
  const [inputProfileId, setInputProfileId] = useState<string>('');

  // Loading and error states
  const [loading, setLoading] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

  // Form data states
  const [updateForm, setUpdateForm] = useState<ProfileUpdateFormData>({
    username: '',
    bio: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Handle profile ID form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileId(inputProfileId);
    
    // Reset response data when changing profile ID
    setApiResponse(null);
    
    // Fetch profile data if on GET tab
    if (activeTab === 'get' && inputProfileId) {
      fetchProfile(inputProfileId);
    }
  };

  // GET /api/profiles/[id]
  const fetchProfile = async (id: string) => {
    if (!id) return;
    
    setLoading(true);
    setApiResponse(null);
    
    try {
      const response = await fetch(`/api/profiles/${encodeURIComponent(id)}`);
      const data = await response.json();
      
      setApiResponse({
        data,
        status: response.status,
        error: !response.ok ? data.error || 'Failed to fetch profile' : null
      });
      
      // If profile fetched successfully, update the form data for update tab
      if (response.ok && data.profile) {
        setUpdateForm({
          username: data.profile.username || '',
          bio: data.profile.bio || '',
        });
      }
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

  // PUT /api/profiles/[id]
  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileId) return;
    
    setLoading(true);
    setApiResponse(null);
    
    try {
      const response = await fetch(`/api/profiles/${encodeURIComponent(profileId)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateForm),
      });
      
      const data = await response.json();
      
      setApiResponse({
        data,
        status: response.status,
        error: !response.ok ? data.error || 'Failed to update profile' : null
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

  // PUT /api/profiles/[id]/avatar
  const updateAvatar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileId || !avatarFile) return;
    
    setLoading(true);
    setApiResponse(null);
    
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      
      const response = await fetch(`/api/profiles/${encodeURIComponent(profileId)}/avatar`, {
        method: 'PUT',
        body: formData,
      });
      
      const data = await response.json();
      
      setApiResponse({
        data,
        status: response.status,
        error: !response.ok ? data.error || 'Failed to update avatar' : null
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

  // GET /api/profiles/[id]/recipes
  const fetchUserRecipes = async () => {
    if (!profileId) return;
    
    setLoading(true);
    setApiResponse(null);
    
    try {
      const response = await fetch(`/api/profiles/${encodeURIComponent(profileId)}/recipes?limit=5`);
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

  // GET /api/profiles/[id]/stars
  const fetchUserStars = async () => {
    if (!profileId) return;
    
    setLoading(true);
    setApiResponse(null);
    
    try {
      const response = await fetch(`/api/profiles/${encodeURIComponent(profileId)}/stars?limit=5`);
      const data = await response.json();
      
      setApiResponse({
        data,
        status: response.status,
        error: !response.ok ? data.error || 'Failed to fetch starred recipes' : null
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

  // Handle tab change
  useEffect(() => {
    if (!profileId) return;
    
    // Fetch data based on the active tab
    switch (activeTab) {
      case 'get':
        fetchProfile(profileId);
        break;
      case 'recipes':
        fetchUserRecipes();
        break;
      case 'stars':
        fetchUserStars();
        break;
      default:
        // For update and avatar tabs, just show the form without fetching
        setApiResponse(null);
        break;
    }
  }, [activeTab, profileId]);

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatarFile(e.target.files[0]);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6">
        <Link href="/apitest" className="text-blue-500 hover:underline mb-4 inline-block">
          &larr; Back to API Test Home
        </Link>
        <h1 className="text-3xl font-bold">Profiles API Test</h1>
        <p className="text-gray-600 mt-2">
          Test the various endpoints for the Profiles API
        </p>
      </div>
      
      {/* Profile ID input form */}
      <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profile ID
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputProfileId}
            onChange={(e) => setInputProfileId(e.target.value)}
            placeholder="Enter profile UUID"
            className="flex-1 p-2 border rounded"
            required
          />
          <button 
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Set Profile ID
          </button>
        </div>
        {profileId && (
          <p className="mt-2 text-sm text-gray-600">
            Current Profile ID: <span className="font-mono">{profileId}</span>
          </p>
        )}
      </form>
      
      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('get')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'get'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              GET Profile
            </button>
            <button
              onClick={() => setActiveTab('update')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'update'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              UPDATE Profile
            </button>
            <button
              onClick={() => setActiveTab('avatar')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'avatar'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              UPDATE Avatar
            </button>
            <button
              onClick={() => setActiveTab('recipes')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'recipes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              GET Recipes
            </button>
            <button
              onClick={() => setActiveTab('stars')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'stars'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              GET Stars
            </button>
          </nav>
        </div>
      </div>
      
      {/* Tab content */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {!profileId ? (
          <div className="text-center py-8 text-gray-500">
            Please enter a Profile ID above to test the API endpoints
          </div>
        ) : (
          <>
            {/* GET Profile tab */}
            {activeTab === 'get' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">GET /api/profiles/{profileId}</h2>
                <p className="text-gray-600 mb-4">Fetch user profile data</p>
                
                <button
                  onClick={() => fetchProfile(profileId)}
                  disabled={loading}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Fetch Profile'}
                </button>
              </div>
            )}
            
            {/* UPDATE Profile tab */}
            {activeTab === 'update' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">PUT /api/profiles/{profileId}</h2>
                <p className="text-gray-600 mb-4">Update user profile data</p>
                
                <form onSubmit={updateProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={updateForm.username}
                      onChange={(e) => setUpdateForm(prev => ({ ...prev, username: e.target.value }))}
                      className="w-full p-2 border rounded"
                      placeholder="Enter username"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      value={updateForm.bio}
                      onChange={(e) => setUpdateForm(prev => ({ ...prev, bio: e.target.value }))}
                      className="w-full p-2 border rounded"
                      placeholder="Enter bio"
                      rows={4}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Updating...' : 'Update Profile'}
                  </button>
                </form>
              </div>
            )}
            
            {/* UPDATE Avatar tab */}
            {activeTab === 'avatar' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">PUT /api/profiles/{profileId}/avatar</h2>
                <p className="text-gray-600 mb-4">Upload a new profile avatar</p>
                
                <form onSubmit={updateAvatar} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Avatar Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Maximum file size: 2MB. Accepted formats: JPG, PNG, GIF, WebP
                    </p>
                  </div>
                  
                  {avatarFile && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">Selected file: {avatarFile.name}</p>
                      {avatarFile.type.startsWith('image/') && (
                        <div className="mt-2 border rounded p-2 inline-block">
                          <img
                            src={URL.createObjectURL(avatarFile)}
                            alt="Preview"
                            className="h-24 w-24 object-cover rounded"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={loading || !avatarFile}
                    className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Uploading...' : 'Upload Avatar'}
                  </button>
                </form>
              </div>
            )}
            
            {/* GET Recipes tab */}
            {activeTab === 'recipes' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">GET /api/profiles/{profileId}/recipes</h2>
                <p className="text-gray-600 mb-4">Fetch recipes created by this user</p>
                
                <button
                  onClick={fetchUserRecipes}
                  disabled={loading}
                  className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Fetch Recipes'}
                </button>
              </div>
            )}
            
            {/* GET Stars tab */}
            {activeTab === 'stars' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">GET /api/profiles/{profileId}/stars</h2>
                <p className="text-gray-600 mb-4">Fetch recipes starred by this user</p>
                
                <button
                  onClick={fetchUserStars}
                  disabled={loading}
                  className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Fetch Starred Recipes'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* API response display */}
      {apiResponse && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">API Response</h3>
          <div className={`p-4 rounded-lg ${
            apiResponse.error 
              ? 'bg-red-50 border border-red-200' 
              : 'bg-green-50 border border-green-200'
          }`}>
            <div className="flex justify-between items-start mb-2">
              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                apiResponse.error 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                Status: {apiResponse.status} {apiResponse.error ? 'Error' : 'Success'}
              </span>
              
              <button 
                onClick={() => setApiResponse(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {apiResponse.error && (
              <div className="text-red-700 mb-4">
                Error: {apiResponse.error}
              </div>
            )}
            
            <div className="overflow-auto max-h-96">
              <pre className="text-sm p-2 bg-gray-100 rounded">
                {JSON.stringify(apiResponse.data, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
