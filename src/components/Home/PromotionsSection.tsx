// src/components/sections/PromotionsSection.tsx
import React, { useEffect, useState } from 'react'; // Import useEffect and useState
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getPromotionalProducts, Product } from '@/services/product-service'; // Import from service

interface Promotion extends Product { // Extend Product interface for promotions
  endTime?: string; // ISO string for countdown
}

const PromotionsSection: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        const data = await getPromotionalProducts(2); // AWAIT the async function call
        // Now, data is a Promise<Product[]>
        // Apply the dummy endTime mapping *after* the data is fetched
        const mappedPromotions: Promotion[] = data.map(p => ({
            ...p,
            endTime: p._id === 'someProductIdForFlashDeal' ? new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString() : undefined
            // IMPORTANT: Use p._id for comparison as your backend uses _id, not id
        }));
        setPromotions(mappedPromotions);
      } catch (err) {
        console.error("Failed to fetch promotional products:", err);
        setError("Could not load hot deals.");
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions(); // Call the async function
  }, []); // Empty dependency array means this runs once on mount

  // --- PromotionCard Component (remains mostly the same, but using promotion._id) ---
  const PromotionCard: React.FC<{ promotion: Promotion }> = ({ promotion }) => {
    const [timeLeft, setTimeLeft] = React.useState('');

    React.useEffect(() => {
      if (!promotion.endTime) return;

      const interval = setInterval(() => {
        const total = Date.parse(promotion.endTime!) - Date.now();
        const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const seconds = Math.floor((total / 1000) % 60);

        if (total < 0) {
          clearInterval(interval);
          setTimeLeft('Expired!');
        } else {
          setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }, [promotion.endTime]);

    return (
      <div className="relative rounded-lg overflow-hidden shadow-md group bg-white">
        <img
          src={promotion.imageUrl}
          alt={promotion.name}
          className="w-full h-48 md:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
          {promotion.endTime && timeLeft && timeLeft !== 'Expired!' && (
            <div className="bg-[#D81E05] text-white text-xs font-bold px-2 py-1 rounded-full absolute top-3 left-3 flex items-center gap-1">
              🔥 FLASH DEAL: <span className="font-mono">{timeLeft}</span>
            </div>
          )}
          <h3 className="text-white text-xl font-bold mb-1">{promotion.name}</h3>
          <p className="text-white text-sm mb-3">
            Was: KES {promotion.oldPrice?.toFixed(2)} - Now: KES {promotion.price.toFixed(2)}
          </p>
        <Button className="bg-[#FFD700] hover:bg-yellow-500 text-[#222222] rounded-full font-semibold">
  <Link to={`/product/${promotion._id}`}>Shop Now</Link>
</Button>
        </div>
      </div>
    );
  };

  // --- Main PromotionsSection Render ---
  if (loading) {
    return (
        <section className="py-2">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-[#222222]">🔥 Hot Deals🔥</h2>
            <div className="text-center p-8 bg-gray-100">Loading Hot Deals...</div>
        </section>
    );
  }

  if (error) {
    return (
        <section className="py-2">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-[#222222]">🔥 Hot Deals🔥</h2>
            <div className="text-center p-8 text-red-500 bg-gray-100">Error: {error}</div>
        </section>
    );
  }

  return (
    <section className="py-2">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-[#222222]">
        🔥 Hot Deals🔥
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {promotions.length === 0 ? (
          <div className="text-center p-8 col-span-full bg-gray-100">No hot deals found at the moment.</div>
        ) : (
          promotions.map((promo) => (
            <PromotionCard key={promo._id} promotion={promo} /> 
          ))
        )}
      </div>
    </section>
  );
};

export default PromotionsSection;