// src/app/page.tsx

import HeroSection from '@/components/Home/HeroSection';
import NewArrivalsSection from '@/components/Home/NewArrivalsSection';
import TrendingCategoriesSection from '@/components/Home/TrendingCategoriesSection';
import PersonalizedRecommendationsSection from '@/components/Home/PersonalizedRecommendationsSection';
import PromotionsSection from '@/components/Home/PromotionsSection';
import CommunitySocialProofSection from '@/components/Home/CommunitySocialProofSection';


export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen font-sans"> {/* Added font-sans for general styling */}
   
      <main className="flex-grow">
        <HeroSection />
        {/* Using krystalLight for background of main content sections */}
        <section className="container mx-auto px-4 py-8 space-y-12 md:space-y-16 lg:space-y-20 bg-[#F8F8F8]">
          <NewArrivalsSection />
          <TrendingCategoriesSection />
          <PersonalizedRecommendationsSection />
          <PromotionsSection />
          <CommunitySocialProofSection />
        </section>
      </main>
    
    </div>
  );
}

