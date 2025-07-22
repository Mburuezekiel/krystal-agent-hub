import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getNewArrivals, Product } from '@/services/product-service'; // Assuming Product interface includes category, brand, rating
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react'; // For review stars

// Define price ranges
const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under KES 1,000', min: 0, max: 999.99 },
  { label: 'KES 1,000 - KES 5,000', min: 1000, max: 5000 },
  { label: 'KES 5,000 - KES 10,000', min: 5001, max: 10000 },
  { label: 'Over KES 10,000', min: 10001, max: Infinity },
];

// Define review ratings
const REVIEW_RATINGS = [
  { label: 'All Ratings', minRating: 0 },
  { label: '5 Stars & Up', minRating: 5 },
  { label: '4 Stars & Up', minRating: 4 },
  { label: '3 Stars & Up', minRating: 3 },
  // Add more as needed
];

const NewArrivalsPage: React.FC = () => {
  const allNewArrivals: Product[] = getNewArrivals(); // Get all new arrivals

  // State for filters
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState<{ label: string, min: number, max: number }>(PRICE_RANGES[0]);
  const [selectedBrand, setSelectedBrand] = useState<string>('All Brands');
  const [selectedRating, setSelectedRating] = useState<{ label: string, minRating: number }>(REVIEW_RATINGS[0]);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false); // For mobile responsiveness

  // --- Derived Filter Data ---
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    allNewArrivals.forEach(product => {
      if (product.category) {
        uniqueCategories.add(product.category);
      }
    });
    return ['All', ...Array.from(uniqueCategories).sort()];
  }, [allNewArrivals]);

  const brands = useMemo(() => {
    const uniqueBrands = new Set<string>();
    allNewArrivals.forEach(product => {
      if (product.brand) {
        uniqueBrands.add(product.brand);
      }
    });
    return ['All Brands', ...Array.from(uniqueBrands).sort()];
  }, [allNewArrivals]);

  // --- Filtered Products Logic ---
  const filteredNewArrivals = useMemo(() => {
    let filteredProducts = allNewArrivals;

    // Filter by Category
    if (selectedCategory !== 'All') {
      filteredProducts = filteredProducts.filter(product => product.category === selectedCategory);
    }

    // Filter by Price Range
    if (selectedPriceRange.label !== 'All Prices') {
      filteredProducts = filteredProducts.filter(product =>
        product.price >= selectedPriceRange.min && product.price <= selectedPriceRange.max
      );
    }

    // Filter by Brand
    if (selectedBrand !== 'All Brands') {
      filteredProducts = filteredProducts.filter(product => product.brand === selectedBrand);
    }

    // Filter by Rating
    if (selectedRating.label !== 'All Ratings') {
      filteredProducts = filteredProducts.filter(product =>
        product.rating >= selectedRating.minRating
      );
    }

    return filteredProducts;
  }, [allNewArrivals, selectedCategory, selectedPriceRange, selectedBrand, selectedRating]);

  // Handle sorting (you had a sort by popularity in the image, adding a basic one here)
  const [sortBy, setSortBy] = useState<'popularity' | 'priceAsc' | 'priceDesc'>('popularity');

  const sortedAndFilteredNewArrivals = useMemo(() => {
    let products = [...filteredNewArrivals]; // Create a copy to sort

    if (sortBy === 'priceAsc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceDesc') {
      products.sort((a, b) => b.price - a.price);
    }
    // 'popularity' could be based on a 'salesCount' or a default order if not explicitly defined

    return products;
  }, [filteredNewArrivals, sortBy]);


  return (
    <div className="container mx-auto px-4 py-8 md:py-12 text-[#222222] bg-[#F8F8F8] min-h-screen">
      {/* Breadcrumb Navigation */}
      <nav className="text-sm text-gray-600 mb-6">
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center">
            <Link to="/" className="text-[#D81E05] hover:underline">Home</Link>
            <span className="mx-2">/</span>
          </li>
          <li className="flex items-center text-gray-800">
            New Arrivals
          </li>
        </ol>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-[#222222]">All New In</h1>

      {/* Mobile Filter Toggle */}
      <div className="md:hidden flex justify-end mb-4">
        <Button
          onClick={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)}
          className="bg-[#D81E05] hover:bg-[#A01A04] text-white px-4 py-2 rounded-md"
        >
          {isFilterSidebarOpen ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside
          className={`w-full md:w-64 bg-white p-6 rounded-lg shadow-md ${
            isFilterSidebarOpen ? 'block' : 'hidden'
          } md:block`} // Show/hide based on state for mobile, always show on desktop
        >
          <h2 className="text-xl font-semibold mb-6  text-orange-500">Filters</h2>

          {/* Category Filter */}
          <div className=" mb-6">
            <h3 className="font-medium text-lg mb-3  text-orange-500">Category</h3>
            <ul className="space-y-2">
              {categories.map(category => (
                <li key={category}>
                  <button
                    onClick={() => setSelectedCategory(category)}
                    className={`text-left w-full py-1 ${
                      selectedCategory === category
                        ? 'text-[#D81E05] font-semibold'
                        : 'text-gray-700 hover:text-[#D81E05]'
                    }`}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Range Filter */}
          <div className="mb-6">
            <h3 className="font-medium text-lg mb-3  text-orange-500">Price Range</h3>
            <ul className="space-y-2">
              {PRICE_RANGES.map((range) => (
                <li key={range.label}>
                  <button
                    onClick={() => setSelectedPriceRange(range)}
                    className={`text-left w-full py-1 ${
                      selectedPriceRange.label === range.label
                        ? 'text-[#D81E05] font-semibold'
                        : 'text-gray-700 hover:text-[#D81E05]'
                    }`}
                  >
                    {range.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Brand Filter */}
          <div className="mb-6">
            <h3 className="font-medium text-lg mb-3 text-orange-500">Brand</h3>
            <ul className="space-y-2">
              {brands.map(brand => (
                <li key={brand}>
                  <button
                    onClick={() => setSelectedBrand(brand)}
                    className={`text-left w-full py-1 ${
                      selectedBrand === brand
                        ? 'text-[#D81E05] font-semibold'
                        : 'text-gray-700 hover:text-[#D81E05]'
                    }`}
                  >
                    {brand}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Reviews Filter */}
          <div className="mb-6">
            <h3 className="font-medium text-lg mb-3">Customer Reviews</h3>
            <ul className="space-y-2">
              {REVIEW_RATINGS.map((ratingOption) => (
                <li key={ratingOption.label}>
                  <button
                    onClick={() => setSelectedRating(ratingOption)}
                    className={`flex items-center text-left w-full py-1 ${
                      selectedRating.label === ratingOption.label
                        ? 'text-[#D81E05] font-semibold'
                        : 'text-gray-700 hover:text-[#D81E05]'
                    }`}
                  >
                    {ratingOption.minRating > 0 && (
                      <span className="flex mr-1">
                        {Array.from({ length: ratingOption.minRating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        {ratingOption.minRating < 5 && (
                            <span className="text-gray-500 ml-1">& Up</span>
                        )}
                      </span>
                    )}
                    {ratingOption.label === 'All Ratings' ? 'All Ratings' : null}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Product Display Area */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-700">Showing {sortedAndFilteredNewArrivals.length} products</span>
            <div className="flex items-center">
              <label htmlFor="sort-by" className="text-gray-700 mr-2 text-sm">Sort by:</label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'popularity' | 'priceAsc' | 'priceDesc')}
                className="border rounded-md px-3 py-1 text-sm bg-white"
              >
                <option value="popularity">Popularity</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {sortedAndFilteredNewArrivals.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-lg text-gray-700 mb-4">No new arrivals found matching your filters.</p>
              <Button asChild className="bg-[#D81E05] hover:bg-[#A01A04] text-white rounded-full px-8 py-3 text-lg font-semibold">
                <Link to="/">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sortedAndFilteredNewArrivals.map((product) => (
                <Link to={`/product/${product.id}`} key={product.id} className="group block">
                  <Card className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
                    <CardContent className="p-0">
                      <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = `https://placehold.co/400x400/E0E0E0/666666?text=Image+Error`;
                            e.currentTarget.onerror = null;
                          }}
                        />
                        {product.isNew && (
                          <span className="absolute top-2 left-2 bg-[#D81E05] text-white text-xs px-2 py-1 rounded-full font-semibold">NEW</span>
                        )}
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
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default NewArrivalsPage;