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
        setError("Could not load recommendations.");
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

    return () => {
      stopAutoplay();
    };
  }, [api, startAutoplay, stopAutoplay]);

  if (loading) {
    return (
      <section className="py-8 bg-[#F8F8F8] ">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-[#222222]">
          🛍️ Shop by Category 🛍️
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {homepageCategories.map((category) => (
            <Link
              to={`/category/${encodeURIComponent(category.name)}`}
              key={category.name}
              className="group block relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-full aspect-square bg-gray-100">
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-60 flex items-center justify-center transition-all duration-300">
                <h3 className="text-white text-xl md:text-2xl font-bold text-center drop-shadow-lg">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
        <br />
        <h6 className="text-3xl md:text-xl bg-orange-500 font-bold text-center mb-8 text-[#F8F8F8]">
          Picked For You
        </h6>
        <div className="text-center p-8">Loading recommendations...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 bg-[#F8F8F8] ">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-[#222222]">
          🛍️ Shop by Category 🛍️
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {homepageCategories.map((category) => (
            <Link
              to={`/category/${encodeURIComponent(category.name)}`}
              key={category.name}
              className="group block relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-full aspect-square bg-gray-100">
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-60 flex items-center justify-center transition-all duration-300">
                <h3 className="text-white text-xl md:text-2xl font-bold text-center drop-shadow-lg">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
        <br />
        <h6 className="text-3xl md:text-xl bg-orange-500 font-bold text-center mb-8 text-[#F8F8F8]">
          Picked For You
        </h6>
        <div className="text-center p-8 text-red-500">Error: {error}</div>
      </section>
    );
  }

  if (!hasRecommendations) {
    return (
      <section className="py-8 bg-[#F8F8F8] ">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-[#222222]">
          🛍️ Shop by Category 🛍️
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {homepageCategories.map((category) => (
            <Link
              to={`/category/${encodeURIComponent(category.name)}`}
              key={category.name}
              className="group block relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-full aspect-square bg-gray-100">
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-60 flex items-center justify-center transition-all duration-300">
                <h3 className="text-white text-xl md:text-2xl font-bold text-center drop-shadow-lg">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
        <br />
        <h6 className="text-3xl md:text-xl bg-orange-500 font-bold text-center mb-8 text-[#F8F8F8]">
          Picked For You
        </h6>
        <div className="text-center p-8">
          No recommendations found at the moment.
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-[#F8F8F8] ">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-[#222222]">
        🛍️ Shop by Category 🛍️
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {homepageCategories.map((category) => (
          <Link
            to={`/category/${encodeURIComponent(category.name)}`}
            key={category.name}
            className="group block relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <div className="w-full aspect-square bg-gray-100">
              <img
                src={category.imageUrl}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-60 flex items-center justify-center transition-all duration-300">
              <h3 className="text-white text-xl md:text-2xl font-bold text-center drop-shadow-lg">
                {category.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
      <br />
      <h6 className="text-3xl md:text-xl bg-orange-500 font-bold text-center  mb-8 text-[#F8F8F8]">
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
        <CarouselContent className="-ml-4">
          {recommendations.map((product) => (
            <CarouselItem
              key={product._id}
              className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-4"
            >
              <Link to={`/product/${product._id}`} className="group block">
                {" "}
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
                        <p className="text-base font-semibold text-[#D81E05]">
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

export default TrendingCategoriesSection;
