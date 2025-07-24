// src/components/sections/HeroSection.tsx
import React, { useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import Autoplay from 'embla-carousel-autoplay'; // Autoplay plugin for Embla Carousel
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
    imageSrc: Arrivals,
    altText: 'Mega Sale Event Banner',
    title: 'Mega Sale Event: Up to 70% Off!',
    subtitle: 'Unbeatable deals across all categories. Shop smart, save big!',
    ctaText: 'Explore Deals',
    ctaLink: '/sale',
  },
  {
    id: '2',
    imageSrc: Home,
    altText: 'Home Essentials Banner',
    title: 'Your Home, Your Style',
    subtitle: 'Find everything for your living space, from kitchen to decor.',
    ctaText: 'Shop Home & Kitchen',
    ctaLink: '/category/Home-%26-Kitchen', // Use slugified link
  },
  {
    id: '3',
    imageSrc: Fashion,
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

  // Autoplay plugin instance
  // Set stopOnInteraction and stopOnMouseEnter to false to ensure continuous autoplay
  // regardless of mouse presence or user interaction.
  // For typical user experience, these are often true.
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: false }) // Autoplay every 4 seconds
  );

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap()); // Set initial slide

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);

    // Clean up the event listener when the component unmounts or API changes
    return () => {
      api.off("select", onSelect);
    };
  }, [api]); // Dependency array includes 'api' to re-run if the API instance changes

  return (
    <section className="relative w-full overflow-hidden">
      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fadeInSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInSlideUp {
          animation: fadeInSlideUp 0.7s ease-out forwards;
        }
        .animate-delay-200 { animation-delay: 0.2s; }
        .animate-delay-400 { animation-delay: 0.4s; }
      `}</style>

      <Carousel
        opts={{
          loop: true, // Ensures the carousel loops continuously
        }}
        plugins={[plugin.current]} // Apply the autoplay plugin
        setApi={setApi} // Pass setApi to Carousel to get the API instance
        className="w-full"
      >
        <CarouselContent>
          {heroSlides.map((slide, index) => (
            <CarouselItem key={slide.id}>
              <div className="relative w-full h-[300px] md:h-[500px] lg:h-[600px] bg-gray-200">
                <img
                  src={slide.imageSrc}
                  alt={slide.altText}
                  className="w-full h-full object-cover"
                />
                {/* Content with animation classes */}
                <div
                  // Key change forces re-render of children, re-triggering animations
                  // This ensures the animation plays each time a new slide becomes active.
                  key={current}
                  className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center p-4"
                >
                  <h2 className={`text-white text-3xl md:text-5xl font-extrabold drop-shadow-lg mb-2 opacity-0 ${index === current ? 'animate-fadeInSlideUp' : ''}`}>
                    {slide.title}
                  </h2>
                  <p className={`text-white text-lg md:text-xl mb-6 max-w-2xl opacity-0 ${index === current ? 'animate-fadeInSlideUp animate-delay-200' : ''}`}>
                    {slide.subtitle}
                  </p>
                  <Button asChild className={`bg-[#FFD700] hover:bg-yellow-500 text-[#222222] text-lg px-8 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 font-semibold opacity-0 ${index === current ? 'animate-fadeInSlideUp animate-delay-400' : ''}`}>
                    <Link to={slide.ctaLink}>{slide.ctaText}</Link>
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Removed CarouselPrevious and CarouselNext as requested */}

        {/* Dot Pagination - All dots equal size, active dot color changed */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-row gap-2 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)} // Scroll to the clicked slide
              className={`
                w-3 h-3 rounded-full transition-colors duration-300
                ${index === current ? 'bg-[#D81E05]' : 'bg-gray-400 hover:bg-gray-200'}
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