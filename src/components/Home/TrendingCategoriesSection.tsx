// src/components/sections/TrendingCategoriesSection.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ALL_CATEGORIES } from '@/services/product-service'; // Import all categories

interface CategoryDisplay {
  name: string;
  imageUrl: string;
}

// Select a subset of categories for display on the homepage
const homepageCategories: CategoryDisplay[] = [
  { name: 'Women Clothing', imageUrl: 'https://placehold.co/400x400/D81E05/FFFFFF?text=Women' },
  { name: 'Men Clothing', imageUrl: 'https://placehold.co/400x400/222222/FFFFFF?text=Men' },
  { name: 'Home & Kitchen', imageUrl: 'https://placehold.co/400x400/FFD700/222222?text=Home' },
  { name: 'Electronics', imageUrl: 'https://placehold.co/400x400/F8F8F8/222222?text=Electronics' },
  { name: 'Kids', imageUrl: 'https://placehold.co/400x400/D81E05/FFFFFF?text=Kids' },
  { name: 'Jewelry & Accessories', imageUrl: 'https://placehold.co/400x400/222222/FFFFFF?text=Jewelry' },
];

const TrendingCategoriesSection: React.FC = () => {
  return (
    <section className="py-8">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-[#222222]"> {/* Krystal Dark */}
        🛍️ Shop by Category 🛍️
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {homepageCategories.map((category) => (
          <Link to={`/category/${encodeURIComponent(category.name)}`} key={category.name} className="group block relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
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
    </section>
  );
};

export default TrendingCategoriesSection;

