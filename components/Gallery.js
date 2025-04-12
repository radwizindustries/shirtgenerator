import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Gallery() {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchDesigns();
  }, []);

  useEffect(() => {
    if (designs.length > 3) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          // When we reach the end, smoothly transition back to the start
          if (prevIndex >= designs.length - 3) {
            return 0;
          }
          return prevIndex + 1;
        });
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [designs.length]);

  const fetchDesigns = async () => {
    try {
      const { data, error } = await supabase
        .from('shirt_designs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDesigns(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center text-white">Loading gallery...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;
  if (designs.length === 0) return <div className="text-center text-white">No designs yet!</div>;

  // Create a circular array of designs for smooth looping
  const visibleDesigns = designs.length > 3 
    ? [...designs, ...designs.slice(0, 3)] // Add first 3 images at the end for smooth looping
    : designs;

  return (
    <div className="w-full overflow-hidden">
      <div className="flex justify-center">
        <div className="relative w-[calc(256px*3)] overflow-hidden">
          <div 
            className="flex space-x-4 transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 256}px)`,
              width: `${visibleDesigns.length * 256}px`
            }}
          >
            {visibleDesigns.map((design, index) => (
              <div 
                key={`${design.id}-${index}`} 
                className="flex-shrink-0 w-64"
              >
                <div className="relative group">
                  <img
                    src={`/api/image-proxy?url=${encodeURIComponent(design.image_url)}`}
                    alt={design.prompt}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white text-sm">{design.prompt}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 