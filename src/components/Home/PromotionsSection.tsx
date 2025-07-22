// src/components/sections/PromotionsSection.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getPromotionalProducts, Product } from '@/services/product-service'; // Import from service

interface Promotion extends Product { // Extend Product interface for promotions
  endTime?: string; // ISO string for countdown
}

const PromotionsSection: React.FC = () => {
  // Get promotional products and add a dummy endTime for flash deals
  const promotions: Promotion[] = getPromotionalProducts(2).map(p => ({
    ...p,
    endTime: p.id === 'p5' ? new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString() : undefined // Example: p5 is a flash deal
  }));

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
          alt={promotion.name} // Use product name for alt text
          className="w-full h-48 md:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
          {promotion.endTime && timeLeft && timeLeft !== 'Expired!' && (
            <div className="bg-[#D81E05] text-white text-xs font-bold px-2 py-1 rounded-full absolute top-3 left-3 flex items-center gap-1"> {/* Krystal Red */}
              🔥 FLASH DEAL: <span className="font-mono">{timeLeft}</span>
            </div>
          )}
          <h3 className="text-white text-xl font-bold mb-1">{promotion.name}</h3> {/* Use product name */}
          <p className="text-white text-sm mb-3">
            Was: KES {promotion.oldPrice?.toFixed(2)} - Now: KES {promotion.price.toFixed(2)}
          </p>
          {/* CRITICAL FIX: Ensure NO whitespace or comments between <Button asChild> and <Link> */}
          <Button asChild className="bg-[#FFD700] hover:bg-yellow-500 text-[#222222] rounded-full font-semibold">
            <Link to={`/product/${promotion.id}`}>Shop Now</Link>
          </Button>
        </div>
      </div>
    );
  };

  return (
    <section className="py-8">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-[#222222]"> {/* Krystal Dark */}
        🔥 Hot Deals & Promotions🔥
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {promotions.map((promo) => (
          <PromotionCard key={promo.id} promotion={promo} />
        ))}
      </div>
    </section>
  );
};

export default PromotionsSection;

