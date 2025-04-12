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

      // Create product with Printful
      const printfulResponse = await fetch('/api/printful', {
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

      if (!printfulResponse.ok) {
        const error = await printfulResponse.json();
        throw new Error(error.error || 'Failed to create product');
      }

      const { mockupUrl } = await printfulResponse.json();
      setImageUrl(mockupUrl);

      // Save to gallery
      const { error: saveError } = await supabase
        .from('shirt_designs')
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

      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center mb-12">
          <p className="text-lg text-purple-100 mb-8">
            Describe your dream t-shirt design and let AI bring it to life!
          </p>
          
          {!user && (
            <div className="mb-4 p-4 bg-purple-800/50 rounded-lg">
              <p className="text-white">
                Please <Link href="/login" className="text-purple-300 hover:underline">sign in</Link> or{' '}
                <Link href="/signup" className="text-purple-300 hover:underline">create an account</Link> to generate designs.
              </p>
            </div>
          )}

          {user && !isAdmin && generationCount >= MAX_GENERATIONS && (
            <div className="mb-4 p-4 bg-red-900/50 rounded-lg">
              <p className="text-white">
                You've reached your generation limit. Please try again later.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-4 items-center">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A glowing dragon on a mountain"
              className="w-full max-w-md p-3 rounded text-black mb-4"
              disabled={!user || (!isAdmin && generationCount >= MAX_GENERATIONS)}
            />

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt || !user || (!isAdmin && generationCount >= MAX_GENERATIONS)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded mb-4 disabled:opacity-50"
            >
              {isGenerating ? "Generating..." : "Generate"}
            </button>
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}
          
          {/* Results Section */}
          {(isGenerating || imageUrl) && (
            <div className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Generated Design */}
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Generated Design</h3>
                  <div className="flex-1 flex items-center justify-center">
                    {isGenerating ? (
                      <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center animate-pulse">
                        <p className="text-gray-500">Generating...</p>
                      </div>
                    ) : imageUrl ? (
                      <div className="relative w-full max-w-2xl mx-auto">
                        <img
                          src={`/api/image-proxy?url=${encodeURIComponent(imageUrl)}`}
                          alt="Generated design"
                          className="w-full h-auto rounded-lg shadow-lg object-contain h-96"
                        />
                        {selectedDesign && (
                          <div className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded text-sm">
                            From Gallery
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Gelato Template Preview */}
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Shirt Preview</h3>
                  {isGenerating ? (
                    <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center animate-pulse">
                      <p className="text-gray-500">Loading preview...</p>
                    </div>
                  ) : imageUrl ? (
                    <div className="relative w-full max-w-2xl mx-auto">
                      <img
                        src={`/api/get-mockups?color=${encodeURIComponent(selectedColor.value)}`}
                        alt="Shirt preview"
                        className="w-full rounded-lg shadow-lg object-contain h-96"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img
                          src={imageUrl}
                          alt="Design overlay"
                          className="w-3/4 h-3/4 object-contain"
                          style={{ 
                            mixBlendMode: 'multiply',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)'
                          }}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )}

          {/* Gallery Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-purple-300 mb-8 text-center">Design Gallery</h2>
            <Gallery onImageSelect={handleImageSelect} />
          </div>
        </div>
      </div>
    </div>
  );
}
