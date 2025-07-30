import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getNewArrivals, Product } from '@/services/product-service';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Loader2, AlertCircle } from 'lucide-react';
import { ProductCard } from '@/components/common/ProductCard';

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
];

// StarRating component (reused for consistency)
const StarRating = ({ rating, size = "w-4 h-4" }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          className={`${size} ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
};

const NewArrivalsPage: React.FC = () => {
  const [allNewArrivals, setAllNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState<{ label: string, min: number, max: number }>(PRICE_RANGES[0]);
  const [selectedBrand, setSelectedBrand] = useState<string>('All Brands');
  const [selectedRating, setSelectedRating] = useState<{ label: string, minRating: number }>(REVIEW_RATINGS[0]);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

  const [sortBy, setSortBy] = useState<'popularity' | 'priceAsc' | 'priceDesc'>('popularity');

  useEffect(() => {
    const fetchNewArrivalsData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getNewArrivals();
        setAllNewArrivals(data);
      } catch (err) {
        console.error("Failed to fetch new arrivals:", err);
        setError("Could not load new arrivals. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivalsData();
  }, []);

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

  const filteredNewArrivals = useMemo(() => {
    let filteredProducts = allNewArrivals;

    if (selectedCategory !== 'All') {
      filteredProducts = filteredProducts.filter(product => product.category === selectedCategory);
    }

    if (selectedPriceRange.label !== 'All Prices') {
      filteredProducts = filteredProducts.filter(product =>
        product.price >= selectedPriceRange.min && product.price <= selectedPriceRange.max
      );
    }

    if (selectedBrand !== 'All Brands') {
      filteredProducts = filteredProducts.filter(product => product.brand === selectedBrand);
    }

    if (selectedRating.label !== 'All Ratings') {
      filteredProducts = filteredProducts.filter(product =>
        (product.rating || 0) >= selectedRating.minRating
      );
    }

    return filteredProducts;
  }, [allNewArrivals, selectedCategory, selectedPriceRange, selectedBrand, selectedRating]);

  const sortedAndFilteredNewArrivals = useMemo(() => {
    let products = [...filteredNewArrivals];

    if (sortBy === 'priceAsc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceDesc') {
      products.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'popularity') {
      products.sort((a, b) => {
        const popularityA = (a.rating || 0) * (a.numReviews || 1);
        const popularityB = (b.rating || 0) * (b.numReviews || 1);
        return popularityB - popularityA;
      });
    }
    return products;
  }, [filteredNewArrivals, sortBy]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-100px)] text-[#222222] bg-[#F8F8F8] pb-24">
        <Loader2 className="h-12 w-12 animate-spin text-[#D81E05]" />
        <p className="mt-4 text-xl text-muted-foreground">Loading new arrivals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-100px)] text-[#222222] bg-[#F8F8F8] pb-24">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="mt-4 text-xl text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-6 bg-[#D81E05] hover:bg-[#A01A04] text-white">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 text-[#222222] bg-[#F8F8F8] min-h-screen pb-24">
      <nav className="text-sm text-gray-600 mb-6">
        <ol className="list-none p-0 inline-flex flex-wrap">
          <li className="flex items-center">
            <Link to="/" className="text-[#D81E05] hover:underline text-xs sm:text-sm">Home</Link>
            <span className="mx-1 sm:mx-2">/</span>
          </li>
          <li className="flex items-center text-gray-800 text-xs sm:text-sm">
            New Arrivals
          </li>
        </ol>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-[#222222]">All New In</h1>

      <div className="md:hidden flex justify-end mb-4">
        <Button
          onClick={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)}
          className="bg-[#D81E05] hover:bg-[#A01A04] text-white px-4 py-2 rounded-md text-sm"
        >
          {isFilterSidebarOpen ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside
          className={`w-full md:w-64 bg-white p-4 rounded-lg shadow-md md:flex-shrink-0 ${
            isFilterSidebarOpen ? 'block' : 'hidden'
          } md:block`}
        >
          <h2 className="text-xl font-semibold mb-4 text-orange-500">Filters</h2>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-1 gap-x-3 gap-y-4">
            <div>
              <h3 className="font-medium text-base mb-2 text-orange-500">Category</h3>
              <ul className="space-y-1">
                {categories.map(category => (
                  <li key={category}>
                    <button
                      onClick={() => setSelectedCategory(category)}
                      className={`text-left w-full text-sm py-0.5 ${
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

            <div>
              <h3 className="font-medium text-base mb-2 text-orange-500">Price Range</h3>
              <ul className="space-y-1">
                {PRICE_RANGES.map((range) => (
                  <li key={range.label}>
                    <button
                      onClick={() => setSelectedPriceRange(range)}
                      className={`text-left w-full text-sm py-0.5 ${
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

            <div>
              <h3 className="font-medium text-base mb-2 text-orange-500">Brand</h3>
              <ul className="space-y-1">
                {brands.map(brand => (
                  <li key={brand}>
                    <button
                      onClick={() => setSelectedBrand(brand)}
                      className={`text-left w-full text-sm py-0.5 ${
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

            <div>
              <h3 className="font-medium text-base mb-2 text-orange-500">Customer Reviews</h3>
              <ul className="space-y-1">
                {REVIEW_RATINGS.map((ratingOption) => (
                  <li key={ratingOption.label}>
                    <button
                      onClick={() => setSelectedRating(ratingOption)}
                      className={`flex items-center text-left w-full text-sm py-0.5 ${
                        selectedRating.label === ratingOption.label
                          ? 'text-[#D81E05] font-semibold'
                          : 'text-gray-700 hover:text-[#D81E05]'
                      }`}
                    >
                      {ratingOption.minRating > 0 && (
                        <span className="flex mr-1">
                          {Array.from({ length: ratingOption.minRating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          ))}
                          {ratingOption.minRating < 5 && (
                              <span className="text-gray-500 ml-0.5 text-xs">& Up</span>
                          )}
                        </span>
                      )}
                      {ratingOption.label === 'All Ratings' ? 'All Ratings' : null}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <div className="flex justify-between items-center mb-4 p-2 sm:p-0">
            <span className="text-gray-700 text-sm">Showing {sortedAndFilteredNewArrivals.length} products</span>
            <div className="flex items-center">
              <label htmlFor="sort-by" className="text-gray-700 mr-1 text-sm">Sort:</label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'popularity' | 'priceAsc' | 'priceDesc')}
                className="border rounded-md px-2 py-1 text-sm bg-white"
              >
                <option value="popularity">Popularity</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {sortedAndFilteredNewArrivals.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow-md mx-4 sm:mx-0">
              <p className="text-base text-gray-700 mb-4">No new arrivals found matching your filters.</p>
              <Button asChild className="bg-[#D81E05] hover:bg-[#A01A04] text-white rounded-full px-6 py-2.5 text-base font-semibold">
                <Link to="/">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 items-stretch">
              {sortedAndFilteredNewArrivals.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default NewArrivalsPage;