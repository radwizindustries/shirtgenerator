import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

export default function Gallery({ onImageSelect }) {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoadErrors, setImageLoadErrors] = useState({});
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
      const { data, error } = await supabase
        .from('shirt_designs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDesigns(data);
    } catch (error) {
      console.error('Error fetching designs:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (designId) => {
    setImageLoadErrors(prev => ({
      ...prev,
      [designId]: true
    }));
  };

  const getImageUrl = (url) => {
    try {
      return `/api/image-proxy?url=${encodeURIComponent(url)}`;
    } catch (error) {
      console.error('Error encoding image URL:', error);
      return url; // Fallback to original URL
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
            key={`${design.id}-${index}`}
            className="flex-shrink-0 w-1/6 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => onImageSelect(design)}
          >
            <div className="relative aspect-square">
              {imageLoadErrors[design.id] ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-800 rounded-lg">
                  <p className="text-white text-sm">Failed to load image</p>
                </div>
              ) : (
                <img
                  src={getImageUrl(design.image_url)}
                  alt={design.prompt}
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                  onError={() => handleImageError(design.id)}
                  loading="lazy"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 rounded-b-lg">
                <p className="text-white text-sm truncate">{design.prompt}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 