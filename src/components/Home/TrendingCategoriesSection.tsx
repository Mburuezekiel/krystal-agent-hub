import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "../ui/carousel";
import {
  getPersonalizedRecommendations,
  Product,
} from "@/services/product-service";
import womenclothing from "../../assets/womenclothing.png";
import menclothing from "../../assets/menclothing.png";
import kids from "../../assets/kids.jpg";
import home from "../../assets/homeandkitchen.jpg";
import jewelry from "../../assets/jewelry.png";
import electonics from "../../assets/electronics.png";
import { Loader2, AlertCircle } from 'lucide-react';

interface CategoryDisplay {
  name: string;
  imageUrl: string;
}

const homepageCategories: CategoryDisplay[] = [
  {
    name: "Women Clothing",
    imageUrl: womenclothing,
  },
  {
    name: "Men Clothing",
    imageUrl: menclothing,
  },
  {
    name: "Home & Kitchen",
    imageUrl: home,
  },
  {
    name: "Electronics",
    imageUrl: electonics,
  },
  {
    name: "Kids",
    imageUrl: kids,
  },
  {
    name: "Jewelry & Accessories",
    imageUrl: jewelry,
  },
];

const TrendingCategoriesSection: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPersonalizedRecommendations(undefined, 8);
        setRecommendations(data);
      } catch (err) {
        console.error("Failed to fetch personalized recommendations:", err);
        setError("Could not load recommendations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const hasRecommendations = recommendations.length > 0;

  const [api, setApi] = useState<CarouselApi>();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const AUTOPLAY_INTERVAL = 3000;

  const scrollNext = useCallback(() => {
    if (api) {
      if (api.selectedScrollSnap() === api.scrollSnapList().length - 1) {
        api.scrollTo(0);
      } else {
        api.scrollNext();
      }
    }
  }, [api]);

  const startAutoplay = useCallback(() => {
    if (api) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(scrollNext, AUTOPLAY_INTERVAL);
    }
  }, [api, scrollNext]);

  const stopAutoplay = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!api) return;

    startAutoplay();

    api.on("pointerDown", stopAutoplay);
    api.on("pointerUp", startAutoplay);
    api.on("settle", () => {
      if (!timerRef.current) {
        startAutoplay();
      }
    });

    return () => {
      stopAutoplay();
      api.off("pointerDown", stopAutoplay);
      api.off("pointerUp", startAutoplay);
      api.off("settle", startAutoplay);
    };
  }, [api, startAutoplay, stopAutoplay]);


  if (loading) {
    return (
      <section className="py-8 bg-[#F8F8F8] text-[#222222] px-4 md:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          🛍️ Shop by Category 🛍️
        </h2>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {homepageCategories.map((category) => (
            <Link
              to={`/category/${encodeURIComponent(category.name)}`}
              key={category.name}
              className="group block relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 aspect-square"
            >
              <img
                src={category.imageUrl}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-60 flex items-center justify-center transition-all duration-300">
                <h3 className="text-white text-base sm:text-xl md:text-2xl font-bold text-center drop-shadow-lg px-2">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
        <div className="max-w-7xl mx-auto mt-12">
            <h6 className="text-xl md:text-2xl bg-[#D81E05] font-bold text-center py-3 text-white rounded-md mb-8">
              Picked For You
            </h6>
            <div className="flex flex-col justify-center items-center min-h-[200px] bg-white rounded-lg shadow-md p-8">
                <Loader2 className="h-10 w-10 animate-spin text-[#D81E05]" />
                <p className="mt-4 text-lg text-muted-foreground">Loading recommendations...</p>
            </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 bg-[#F8F8F8] text-[#222222] px-4 md:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          🛍️ Shop by Category 🛍️
        </h2>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {homepageCategories.map((category) => (
            <Link
              to={`/category/${encodeURIComponent(category.name)}`}
              key={category.name}
              className="group block relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 aspect-square"
            >
              <img
                src={category.imageUrl}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-60 flex items-center justify-center transition-all duration-300">
                <h3 className="text-white text-base sm:text-xl md:text-2xl font-bold text-center drop-shadow-lg px-2">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
        <div className="max-w-7xl mx-auto mt-12">
            <h6 className="text-xl md:text-2xl bg-[#D81E05] font-bold text-center py-3 text-white rounded-md mb-8">
              Picked For You
            </h6>
            <div className="flex flex-col justify-center items-center min-h-[200px] bg-white rounded-lg shadow-md p-8">
                <AlertCircle className="h-10 w-10 text-red-500" />
                <p className="mt-4 text-lg text-red-500">{error}</p>
            </div>
        </div>
      </section>
    );
  }

  if (!hasRecommendations) {
    return (
      <section className="py-8 bg-[#F8F8F8] text-[#222222] px-4 md:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          🛍️ Shop by Category 🛍️
        </h2>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {homepageCategories.map((category) => (
            <Link
              to={`/category/${encodeURIComponent(category.name)}`}
              key={category.name}
              className="group block relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 aspect-square"
            >
              <img
                src={category.imageUrl}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-60 flex items-center justify-center transition-all duration-300">
                <h3 className="text-white text-base sm:text-xl md:text-2xl font-bold text-center drop-shadow-lg px-2">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
        <div className="max-w-7xl mx-auto mt-12">
            <h6 className="text-xl md:text-2xl bg-[#D81E05] font-bold text-center py-3 text-white rounded-md mb-8">
              Picked For You
            </h6>
            <div className="flex flex-col justify-center items-center min-h-[200px] bg-white rounded-lg shadow-md p-8">
                <p className="text-lg text-gray-700">No recommendations found at the moment. Check back later!</p>
            </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-[#F8F8F8] text-[#222222] px-4 md:px-6 lg:px-8">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
        🛍️ Shop by Category
      </h2>
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
        {homepageCategories.map((category) => (
          <Link
            to={`/category/${encodeURIComponent(category.name)}`}
            key={category.name}
            className="group block relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 aspect-square"
          >
            <img
              src={category.imageUrl}
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-60 flex items-center justify-center transition-all duration-300">
              <h3 className="text-white text-base sm:text-xl md:text-2xl font-bold text-center drop-shadow-lg px-2">
                {category.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      <div className="max-w-7xl mx-auto mt-12">
        <h6 className="text-xl md:text-2xl bg-[#D81E05] font-bold text-center py-3 text-white rounded-md mb-8">
          Picked For You
        </h6>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          setApi={setApi}
          onMouseEnter={stopAutoplay}
          onMouseLeave={startAutoplay}
          className="w-full"
        >
          <CarouselContent className="-ml-2 sm:-ml-3 md:-ml-4">
            {recommendations.map((product) => (
              <CarouselItem
                key={product._id}
                className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-2 sm:pl-3 md:pl-4"
              >
                <Link to={`/product/${product._id}`} className="group block flex flex-col h-full">
                  <Card className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 bg-white flex flex-col h-full">
                    <CardContent className="p-0 flex-grow-0">
                      <div className="w-full h-32 sm:h-40 aspect-square bg-gray-100 overflow-hidden">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = `https://placehold.co/128x128/E0E0E0/666666?text=Image+Error`;
                            e.currentTarget.onerror = null;
                          }}
                        />
                        {product.isNew && (
                          <span className="absolute top-2 left-2 bg-[#D81E05] text-white text-[0.6rem] px-1 py-0.5 rounded-full font-semibold z-10">NEW</span> 
                        )}
                      </div>
                    </CardContent>
                    <div className="p-2 text-center flex-grow flex flex-col justify-between min-h-[5rem] sm:min-h-[6rem]">
                      <h3 className="text-xs sm:text-sm font-medium text-[#222222] mb-0.5 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-center gap-1 mt-auto">
                        {product.oldPrice && (
                          <p className="text-[0.6rem] text-gray-500 line-through">
                            KES {product.oldPrice.toFixed(2)}
                          </p>
                        )}
                        <p className="text-sm font-semibold text-[#D81E05]">
                          KES {product.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#222222] p-2 rounded-full shadow-md z-10 hidden md:flex" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#222222] p-2 rounded-full shadow-md z-10 hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
};

export default TrendingCategoriesSection;