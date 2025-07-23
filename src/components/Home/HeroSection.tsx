// src/components/sections/HeroSection.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card'; // Card and CardContent are not strictly needed here but kept for consistency
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi, // Import CarouselApi type
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import Autoplay from 'embla-carousel-autoplay';
import Home from '../../assets/Home.png';
import Arrivals from '../../assets/Arrivals.png';
import Discover from '../../assets/krystal-logo.png';
import Fashion from '../../assets/Fashion.png';


interface HeroSlide {
  id: string;
  imageSrc: string;
  altText: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

const heroSlides: HeroSlide[] = [

  {
    id: '1',
    imageSrc:Arrivals, // Krystal Dark with Accent
    altText: 'Mega Sale Event Banner',
    title: 'Mega Sale Event: Up to 70% Off!',
    subtitle: 'Unbeatable deals across all categories. Shop smart, save big!',
    ctaText: 'Explore Deals',
    ctaLink: '/sale',
  },
    {
    id: '2',
    imageSrc: Home, // Krystal Accent with Dark text
    altText: 'Home Essentials Banner',
    title: 'Your Home, Your Style',
    subtitle: 'Find everything for your living space, from kitchen to decor.',
    ctaText: 'Shop Home & Kitchen',
    ctaLink: '/category/Home%20&%20Kitchen',
  },
    {
    id: '3',
    imageSrc: Fashion, // Krystal Red
    altText: 'New Arrivals Collection Banner',
    title: 'Discover What\'s New',
    subtitle: 'Fresh styles and products arriving daily. Don\'t miss out!',
    ctaText: 'Shop New In',
    ctaLink: '/new-in',
  }
];

const HeroSection: React.FC = () => {
  const [api, setApi] = React.useState<CarouselApi>(); // State to hold the carousel API
  const [current, setCurrent] = React.useState(0);    // State to track current slide index

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <section className="relative w-full overflow-hidden">
      <Carousel
        opts={{
          loop: true,
        }}
        setApi={setApi} // Pass setApi to Carousel to get the API instance
        className="w-full"
      >
        <CarouselContent>
          {heroSlides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="relative w-full h-[300px] md:h-[500px] lg:h-[600px] bg-gray-200">
                <img
                  src={slide.imageSrc}
                  alt={slide.altText}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center p-4">
                  <h2 className="text-white text-3xl md:text-5xl font-extrabold drop-shadow-lg mb-2">
                    {slide.title}
                  </h2>
                  <p className="text-white text-lg md:text-xl mb-6 max-w-2xl">
                    {slide.subtitle}
                  </p>
                  <Button asChild className="bg-[#FFD700] hover:bg-yellow-500 text-[#222222] text-lg px-8 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 font-semibold">
                    <Link to={slide.ctaLink}>{slide.ctaText}</Link>
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 z-10 text-white bg-black/50 hover:bg-black/70" />
        <CarouselNext className="absolute right-4 z-10 text-white bg-black/50 hover:bg-black/70" />

        {/* Dot Pagination - CHANGED: positioned at bottom and horizontal */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-row gap-2 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)} // Scroll to the clicked slide
              className={`
                w-3 h-3 rounded-full transition-all duration-300
                ${index === current ? 'bg-[#D81E05] w-5 h-5' : 'bg-gray-400 hover:bg-gray-200'}
                border border-white shadow-md
              `}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </section>
  );
};

export default HeroSection;

