'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Gallery from "../components/Gallery";
import { useAuth } from "../components/AuthProvider";
import { supabase } from "../lib/supabase";
import Link from 'next/link';

const SHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const SHIRT_COLORS = [
  { name: 'White', value: '#FFFFFF' },
  { name: 'Black', value: '#000000' }
];

const ADMIN_EMAIL = 'thebrianexp@gmail.com';

const MAX_GENERATIONS = 3;

export default function Home() {
  const { user, authLoading, signOut, setUser } = useAuth();
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);
  const [generationCount, setGenerationCount] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState(SHIRT_COLORS[0]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState(null);

  useEffect(() => {
    if (user) {
      setIsAdmin(user.email === ADMIN_EMAIL);
      fetchGenerationCount();
    }
  }, [user]);

  const fetchGenerationCount = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        console.error('Session error:', sessionError);
        setError('Please sign in to generate images');
        return;
      }

      const { count, error } = await supabase
        .from('user_generations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id);

      if (error) throw error;
      setGenerationCount(count || 0);
    } catch (error) {
      console.error('Error fetching generation count:', error);
      setError(error.message);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error('Please sign in to generate images');
      }

      // Generate image with DALL-E
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate image');
      }

      const { imageUrl } = await response.json();
      setImageUrl(imageUrl);

      // Create product with Gelato
      const gelatoResponse = await fetch('/api/gelato', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ 
          imageUrl,
          color: selectedColor 
        }),
      });

      if (!gelatoResponse.ok) {
        const error = await gelatoResponse.json();
        throw new Error(error.error || 'Failed to create product');
      }

      const { mockupUrl } = await gelatoResponse.json();
      setImageUrl(mockupUrl);

      // Save to gallery
      const { error: saveError } = await supabase
        .from('designs')
        .insert([
          {
            user_id: session.user.id,
            prompt,
            image_url: imageUrl,
            mockup_url: mockupUrl,
            color: selectedColor,
          },
        ]);

      if (saveError) throw saveError;

      // Update generation count
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ generations_remaining: user.generations_remaining - 1 })
        .eq('id', session.user.id);

      if (updateError) throw updateError;

      // Refresh user data
      const { data: { user: updatedUser } } = await supabase.auth.getUser();
      setUser(updatedUser);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOrder = async () => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          designUrl: imageUrl,
          size: selectedSize,
          color: selectedColor.value,
          prompt: prompt
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to place order');
      }

      setShowOrderModal(false);
      // Show success message or redirect to orders page
    } catch (error) {
      console.error('Error placing order:', error);
      setError(error.message);
    }
  };

  const handleImageSelect = (design) => {
    setSelectedDesign(design);
    setImageUrl(design.image_url);
    setPrompt(design.prompt);
  };

  if (authLoading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black text-white">
      <div className="bg-gray-800/50 border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="text-xl font-bold text-purple-300">AI Shirt Generator</div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-gray-300">Welcome, {user.user_metadata?.username || user.email}</span>
                <span className="text-gray-400">|</span>
                {!isAdmin && (
                  <span className="text-gray-300">Generations: {generationCount}/{MAX_GENERATIONS}</span>
                )}
                <Link href="/settings" className="text-purple-300 hover:text-purple-200">
                  Settings
                </Link>
                <button
                  onClick={signOut}
                  className="text-purple-300 hover:text-purple-200"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-4">
                <Link href="/login" className="text-purple-300 hover:text-purple-200">
                  Sign In
                </Link>
                <span className="text-gray-400">|</span>
                <Link href="/signup" className="text-purple-300 hover:text-purple-200">
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gray-800/50 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Generate Your Design</h2>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your shirt design..."
                className="w-full h-32 p-4 bg-gray-700 rounded-lg text-white placeholder-gray-400"
              />
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !user}
                className={`mt-4 w-full py-2 px-4 rounded-lg ${
                  isGenerating || !user
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {isGenerating ? 'Generating...' : 'Generate Design'}
              </button>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Gallery</h2>
              <Gallery onImageSelect={handleImageSelect} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800/50 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Your Design</h2>
              {imageUrl ? (
                <div className="relative">
                  <img
                    src={`/api/image-proxy?url=${encodeURIComponent(imageUrl)}`}
                    alt="Generated design"
                    className="w-full h-auto rounded-lg"
                  />
                  {selectedDesign && (
                    <div className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded text-sm">
                      From Gallery
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center bg-gray-700 rounded-lg">
                  <p className="text-gray-400">Your design will appear here</p>
                </div>
              )}
            </div>

            {imageUrl && (
              <div className="bg-gray-800/50 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Order Your Shirt</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Size</label>
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full p-2 bg-gray-700 rounded-lg text-white"
                    >
                      {SHIRT_SIZES.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Color</label>
                    <div className="flex space-x-4">
                      {SHIRT_COLORS.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => setSelectedColor(color)}
                          className={`p-2 rounded-lg ${
                            selectedColor.name === color.name
                              ? 'ring-2 ring-purple-500'
                              : ''
                          }`}
                          style={{ backgroundColor: color.value }}
                        />
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowOrderModal(true)}
                    className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Order Details</h2>
            <div className="mb-4">
              <p className="text-gray-300">Size: {selectedSize}</p>
              <p className="text-gray-300">Color: {selectedColor.name}</p>
              <p className="text-gray-300">Design: {prompt}</p>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowOrderModal(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleOrder}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
