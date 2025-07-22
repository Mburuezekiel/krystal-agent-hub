// src/pages/CategoryPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';

// Assuming these services and components exist in your project
import { getProductsByCategory, Product } from '@/services/product-service';
import { Card, CardContent } from '@/components/ui/card';

const CategoryPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  // Decode the category name from the URL to handle spaces or special characters
  const categoryName = decodeURIComponent(name || '');
  // Fetch all products belonging to the current category initially
  const allProducts: Product[] = getProductsByCategory(categoryName);

  // State for filters and sorting
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>(''); // e.g., 'under-1000', '1000-5000'
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<number>(0); // e.g., 4 for 4 stars & up
  const [sortBy, setSortBy] = useState<string>('popularity'); // e.g., 'popularity', 'newest', 'price-asc', 'price-desc'

  // Use useMemo to re-filter and re-sort products only when dependencies change
  useEffect(() => {
    let currentProducts = [...allProducts]; // Start with all products for the category

    // Apply Price Range Filter
    if (selectedPriceRange) {
      currentProducts = currentProducts.filter(product => {
        const price = product.price;
        switch (selectedPriceRange) {
          case 'under-1000': return price < 1000;
          case '1000-5000': return price >= 1000 && price <= 5000;
          case '5000-10000': return price >= 5000 && price <= 10000;
          case 'over-10000': return price > 10000;
          default: return true;
        }
      });
    }

    // Apply Brand Filter (assuming product has a 'brand' property)
    if (selectedBrand) {
      currentProducts = currentProducts.filter(product =>
        product.brand?.toLowerCase() === selectedBrand.toLowerCase()
      );
    }

    // Apply Rating Filter (assuming product has a 'rating' property)
    if (selectedRating > 0) {
      currentProducts = currentProducts.filter(product =>
        (product.rating || 0) >= selectedRating // Assuming products might have a 'rating' property
      );
    }

    // Apply Sorting
    currentProducts.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          // Assuming products have a 'createdAt' or similar timestamp
          // For now, a simple ID comparison or just return 0 if no date
          return (b.id || 0) - (a.id || 0); // Placeholder for actual date comparison
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'popularity':
        default:
          return 0; // No specific sorting for popularity without a metric
      }
    });

    setFilteredProducts(currentProducts);
  }, [allProducts, selectedPriceRange, selectedBrand, selectedRating, sortBy]);

  // Helper function to render star ratings (mock-up)
  const renderStars = (count: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-4 h-4 ${i < count ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
        </svg>
      );
    }
    return <div className="flex">{stars}</div>;
  };


  return (
    <div className="container mx-auto px-4 py-8 md:py-12 text-[#222222] bg-[#F8F8F8] min-h-screen">
      {/* Page Title */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-8 text-[#222222]">
        Shop {categoryName}
      </h1>

      {/* Main content area: Sidebar + Product Grid */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar for Filters - Hidden on small screens, shown on medium and up */}
        <aside className="w-full md:w-64 bg-white p-6 rounded-lg shadow-sm flex-shrink-0 hidden md:block">
          <h2 className="text-xl font-semibold mb-6 text-[#222222]">Filters</h2>

          {/* Price Range Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-[#222222]">Price Range</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <button
                  onClick={() => setSelectedPriceRange('')}
                  className={`block text-left hover:text-[#D81E05] transition-colors ${selectedPriceRange === '' ? 'font-bold text-[#D81E05]' : ''}`}
                >
                  All Prices
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedPriceRange('under-1000')}
                  className={`block text-left hover:text-[#D81E05] transition-colors ${selectedPriceRange === 'under-1000' ? 'font-bold text-[#D81E05]' : ''}`}
                >
                  Under KES 1,000
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedPriceRange('1000-5000')}
                  className={`block text-left hover:text-[#D81E05] transition-colors ${selectedPriceRange === '1000-5000' ? 'font-bold text-[#D81E05]' : ''}`}
                >
                  KES 1,000 - KES 5,000
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedPriceRange('5000-10000')}
                  className={`block text-left hover:text-[#D81E05] transition-colors ${selectedPriceRange === '5000-10000' ? 'font-bold text-[#D81E05]' : ''}`}
                >
                  KES 5,000 - KES 10,000
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedPriceRange('over-10000')}
                  className={`block text-left hover:text-[#D81E05] transition-colors ${selectedPriceRange === 'over-10000' ? 'font-bold text-[#D81E05]' : ''}`}
                >
                  Over KES 10,000
                </button>
              </li>
            </ul>
          </div>

          {/* Brand Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-[#222222]">Brand</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <button
                  onClick={() => setSelectedBrand('')}
                  className={`block text-left hover:text-[#D81E05] transition-colors ${selectedBrand === '' ? 'font-bold text-[#D81E05]' : ''}`}
                >
                  All Brands
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedBrand('Brand A')}
                  className={`block text-left hover:text-[#D81E05] transition-colors ${selectedBrand === 'Brand A' ? 'font-bold text-[#D81E05]' : ''}`}
                >
                  Brand A
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedBrand('Brand B')}
                  className={`block text-left hover:text-[#D81E05] transition-colors ${selectedBrand === 'Brand B' ? 'font-bold text-[#D81E05]' : ''}`}
                >
                  Brand B
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedBrand('Brand C')}
                  className={`block text-left hover:text-[#D81E05] transition-colors ${selectedBrand === 'Brand C' ? 'font-bold text-[#D81E05]' : ''}`}
                >
                  Brand C
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Reviews Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-[#222222]">Customer Reviews</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <button
                  onClick={() => setSelectedRating(0)}
                  className={`block text-left hover:text-[#D81E05] transition-colors ${selectedRating === 0 ? 'font-bold text-[#D81E05]' : ''}`}
                >
                  All Ratings
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedRating(4)}
                  className={`block text-left hover:text-[#D81E05] transition-colors ${selectedRating === 4 ? 'font-bold text-[#D81E05]' : ''}`}
                >
                  {renderStars(4)} & Up
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedRating(3)}
                  className={`block text-left hover:text-[#D81E05] transition-colors ${selectedRating === 3 ? 'font-bold text-[#D81E05]' : ''}`}
                >
                  {renderStars(3)} & Up
                </button>
              </li>
            </ul>
          </div>
        </aside>

        {/* Product Listing Area */}
        <main className="flex-grow">
          {/* Sorting and Product Count Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 p-4 bg-white rounded-lg shadow-sm">
            <p className="text-sm text-gray-600 mb-2 sm:mb-0">
              Showing <span className="font-semibold">{filteredProducts.length}</span> products
            </p>
            {/* Dropdowns for sorting and filters on small screens */}
            <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 w-full sm:w-auto">
              {/* Sort by Dropdown */}
              <div className="flex items-center gap-2">
                <label htmlFor="sort-by" className="text-sm text-gray-600">Sort by:</label>
                <select
                  id="sort-by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-[#D81E05] focus:border-[#D81E05] transition-colors"
                >
                  <option value="popularity">Popularity</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>

              {/* Price Range Filter Dropdown (visible on small screens only) */}
              <div className="flex items-center gap-2 md:hidden">
                <label htmlFor="price-filter" className="text-sm text-gray-600">Price:</label>
                <select
                  id="price-filter"
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-[#D81E05] focus:border-[#D81E05] transition-colors"
                >
                  <option value="">All Prices</option>
                  <option value="under-1000">Under KES 1,000</option>
                  <option value="1000-5000">KES 1,000 - KES 5,000</option>
                  <option value="5000-10000">KES 5,000 - KES 10,000</option>
                  <option value="over-10000">Over KES 10,000</option>
                </select>
              </div>

              {/* Brand Filter Dropdown (visible on small screens only) */}
              <div className="flex items-center gap-2 md:hidden">
                <label htmlFor="brand-filter" className="text-sm text-gray-600">Brand:</label>
                <select
                  id="brand-filter"
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-[#D81E05] focus:border-[#D81E05] transition-colors"
                >
                  <option value="">All Brands</option>
                  <option value="Brand A">Brand A</option>
                  <option value="Brand B">Brand B</option>
                  <option value="Brand C">Brand C</option>
                </select>
              </div>

              {/* Customer Reviews Filter Dropdown (visible on small screens only) */}
              <div className="flex items-center gap-2 md:hidden">
                <label htmlFor="rating-filter" className="text-sm text-gray-600">Rating:</label>
                <select
                  id="rating-filter"
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(Number(e.target.value))}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-[#D81E05] focus:border-[#D81E05] transition-colors"
                >
                  <option value="0">All Ratings</option>
                  <option value="4">4 Stars & Up</option>
                  <option value="3">3 Stars & Up</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <p className="text-center text-lg text-gray-700 bg-white p-8 rounded-lg shadow-sm">
              No products found matching your criteria. Please adjust your filters!
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map((product) => (
                <Link to={`/product/${product.id}`} key={product.id} className="group block h-full">
                  <Card className="rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 bg-white flex flex-col h-full">
                    <CardContent className="p-0 flex-grow flex flex-col">
                      {/* Product Image */}
                      <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          // Fallback for broken images
                          onError={(e) => {
                            e.currentTarget.src = `https://placehold.co/400x400/E0E0E0/666666?text=Image+Error`;
                            e.currentTarget.onerror = null; // Prevent infinite loop
                          }}
                        />
                        {/* "NEW" Badge */}
                        {product.isNew && (
                          <span className="absolute top-2 left-2 bg-[#D81E05] text-white text-xs px-2 py-1 rounded-full font-semibold z-10">
                            NEW
                          </span>
                        )}
                      </div>
                      {/* Product Details */}
                      <div className="p-3 text-center flex-grow flex flex-col justify-between">
                        <h3 className="text-sm font-medium text-[#222222] mb-1 line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex flex-col items-center justify-center gap-1 mt-2">
                          {product.oldPrice && (
                            <p className="text-xs text-gray-500 line-through">
                              KES {product.oldPrice.toFixed(2)}
                            </p>
                          )}
                          <p className="text-base font-bold text-[#D81E05]">
                            KES {product.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CategoryPage;