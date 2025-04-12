import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

export default function Gallery({ onImageSelect }) {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const scrollInterval = useRef(null);

  useEffect(() => {
    fetchDesigns();
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
      setCurrentIndex((prevIndex) => (prevIndex + 1) % designs.length);
    }, 3000); // Scroll every 3 seconds
  };

  const fetchDesigns = async () => {
    try {
      const { data, error } = await supabase
        .from('designs')
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
  for (let i = 0; i < 6; i++) {
    const index = (currentIndex + i) % designs.length;
    visibleDesigns.push(designs[index]);
  }

  return (
    <div className="relative w-full overflow-hidden">
      <div 
        ref={containerRef}
        className="flex gap-4 transition-transform duration-1000 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * (100 / 6)}%)`,
        }}
      >
        {visibleDesigns.map((design, index) => (
          <div
            key={`${design.id}-${index}`}
            className="flex-shrink-0 w-1/6 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => onImageSelect(design)}
          >
            <div className="relative aspect-square">
              <img
                src={`/api/image-proxy?url=${encodeURIComponent(design.image_url)}`}
                alt={design.prompt}
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
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