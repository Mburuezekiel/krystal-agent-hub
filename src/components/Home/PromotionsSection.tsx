import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getPromotionalProducts, Product } from "@/services/product-service";
import { Loader2, AlertCircle } from "lucide-react";

interface Promotion extends Product {
  endTime?: string;
}

const PromotionsSection: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overallTimeLeft, setOverallTimeLeft] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPromotionalProducts(2);

        const mappedPromotions: Promotion[] = data.map((p, index) => ({
          ...p,
          endTime:
            index === 0
              ? new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
              : undefined,
        }));
        setPromotions(mappedPromotions);
      } catch (err) {
        console.error("Failed to fetch promotional products:", err);
        setError("Could not load hot deals. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  useEffect(() => {
    const promotionWithEndTime = promotions.find(p => p.endTime);
    if (!promotionWithEndTime || !promotionWithEndTime.endTime) {
      setOverallTimeLeft(null);
      return;
    }

    const calculateOverallTimeLeft = () => {
      const total = Date.parse(promotionWithEndTime.endTime!) - Date.now();
      if (total < 0) {
        setOverallTimeLeft("Expired!");
        return true;
      } else {
        const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const seconds = Math.floor((total / 1000) % 60);
        setOverallTimeLeft(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
        return false;
      }
    };

    let expired = calculateOverallTimeLeft();

    let interval: NodeJS.Timeout | null = null;
    if (!expired) {
      interval = setInterval(() => {
        expired = calculateOverallTimeLeft();
        if (expired && interval) {
          clearInterval(interval);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [promotions]);

  const PromotionCard: React.FC<{ promotion: Promotion }> = ({ promotion }) => {
    return (
      <div className="relative rounded-lg overflow-hidden shadow-md group bg-white flex flex-col h-full">
        <div className="relative w-full h-48 md:h-64 overflow-hidden flex-shrink-0">
          <img
            src={promotion.imageUrl}
            alt={promotion.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/400x256/E0E0E0/666666?text=Image+Error`;
              e.currentTarget.onerror = null;
            }}
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
         
          <h3 className="text-white text-lg sm:text-xl font-bold mb-1 line-clamp-2">
            {promotion.name}
          </h3>
          <p className="text-white text-sm mb-3">
            Was:{" "}
            <span className="line-through">
              KES {promotion.oldPrice?.toFixed(2)}
            </span>{" "}
            - Now:{" "}
            <span className="font-bold">KES {promotion.price.toFixed(2)}</span>
          </p>
          <Button
            asChild
            className="bg-[#FFD700] hover:bg-yellow-500 text-[#222222] rounded-full font-semibold self-start px-6 py-2"
          >
            <Link to={`/product/${promotion._id}`}>Shop Now</Link>
          </Button>
        </div>
      </div>
    );
  };

  return (
    <section className="py-8 px-4 md:px-6 lg:px-8 bg-[#F8F8F8] text-[#222222]">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
        🔥 Hot Deals🔥
      </h2>
      {overallTimeLeft && overallTimeLeft !== "Expired!" && (
        <div className="bg-[#D81E05] text-white text-[0.8rem] sm:text-base font-bold px-4 py-2 rounded-lg flex items-center justify-center gap-2 mb-8 mx-auto max-w-fit">
          🔥 FLASH DEAL ENDS IN: <span className="font-mono text-lg sm:text-xl">{overallTimeLeft}</span>
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col justify-center items-center min-h-[200px] bg-white rounded-lg shadow-md p-8">
            <Loader2 className="h-10 w-10 animate-spin text-[#D81E05]" />
            <p className="mt-4 text-lg text-muted-foreground">
              Loading hot deals...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center min-h-[200px] bg-white rounded-lg shadow-md p-8">
            <AlertCircle className="h-10 w-10 text-red-500" />
            <p className="mt-4 text-lg text-red-500">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-6 bg-[#D81E05] hover:bg-[#A01A04] text-white"
            >
              Retry
            </Button>
          </div>
        ) : promotions.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <p className="text-lg text-gray-700">
              No hot deals found at the moment. Check back later!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 gap-6 items-stretch">
            {promotions.map((promo) => (
              <PromotionCard key={promo._id} promotion={promo} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PromotionsSection;