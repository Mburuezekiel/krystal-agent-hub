// src/components/sections/PersonalizedRecommendationsSection.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { getPersonalizedRecommendations, Product } from '@/services/product-service'; // Import from service

const PersonalizedRecommendationsSection: React.FC = () => {
  const recommendations: Product[] = getPersonalizedRecommendations(undefined, 8); // Get 8 recommendations

  const hasRecommendations = recommendations.length > 0;

  if (!hasRecommendations) {
    return null; // Don't render if no recommendations
  }

  return (
    <section className="py-8">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-[#222222]"> {/* Krystal Dark */}
        ✨ Picked For You ✨
      </h2>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {recommendations.map((product) => (
            <CarouselItem key={product.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-4">
              <Link to={`/product/${product.id}`} className="group block">
                <Card className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
                  <CardContent className="p-0">
                    <div className="w-full aspect-square bg-gray-100 overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3 text-center">
                      <h3 className="text-sm font-medium text-[#222222] mb-1 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-center gap-2">
                        {product.oldPrice && (
                          <p className="text-xs text-gray-500 line-through">
                            KES {product.oldPrice.toFixed(2)}
                          </p>
                        )}
                        <p className="text-base font-semibold text-[#D81E05]"> {/* Krystal Red */}
                          KES {product.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70" />
        <CarouselNext className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70" />
      </Carousel>
    </section>
  );
};

export default PersonalizedRecommendationsSection;

