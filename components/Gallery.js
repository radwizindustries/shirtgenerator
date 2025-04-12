import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

export default function Gallery({ onImageSelect }) {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const scrollInterval = useRef(null);
  const isScrolling = useRef(false);

  useEffect(() => {
    fetchDesigns();
    return () => {
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    if (designs.length > 0) {
      startAutoScroll();
    }
    return () => {
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
      }
    };
  }, [designs]);

  const startAutoScroll = () => {
    scrollInterval.current = setInterval(() => {
      if (!isScrolling.current) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % designs.length);
      }
    }, 3000);
  };

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('shirt_designs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform data to use permanent URLs
      const designsWithUrls = data.map(design => ({
        ...design,
        display_url: design.permanent_image_url || design.image_url
      }));
      
      setDesigns(designsWithUrls);
    } catch (error) {
      console.error('Error fetching designs:', error);
      setError('Failed to load designs');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-white">Loading gallery...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (designs.length === 0) {
    return <div className="text-center text-white">No designs found</div>;
  }

  // Create a circular array of designs for seamless scrolling
  const visibleDesigns = [];
  for (let i = 0; i < 12; i++) { // Double the array for seamless scrolling
    const index = (currentIndex + i) % designs.length;
    visibleDesigns.push(designs[index]);
  }

  return (
    <div className="relative w-full overflow-hidden">
      <div 
        ref={containerRef}
        className="flex gap-4 transition-transform duration-1000 ease-in-out"
        style={{
          transform: `translateX(-${(currentIndex % 6) * (100 / 6)}%)`,
        }}
        onMouseEnter={() => isScrolling.current = true}
        onMouseLeave={() => isScrolling.current = false}
      >
        {visibleDesigns.map((design, index) => (
          <div
            key={design.id}
            className={`relative transition-opacity duration-300 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-lg">
              <img
                src={design.display_url}
                alt={design.prompt}
                className="h-full w-full object-cover cursor-pointer hover:opacity-90"
                onClick={() => onImageSelect(design)}
              />
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {design.prompt}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 