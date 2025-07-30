import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, AlertCircle, WifiOff, Star } from 'lucide-react';

import { getProductsByCategory, Product } from '@/services/product-service';
import { ProductCard } from '@/components/common/ProductCard';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { Button } from '@/components/ui/button';

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

const CategoryPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const categoryName = useMemo(() => {
    if (!name) return '';
    let decodedName = decodeURIComponent(name.replace(/-/g, ' '));
    decodedName = decodedName.replace(/\band\b/gi, '&');
    return decodedName;
  }, [name]);

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isOnline, wasOffline } = useNetworkStatus();

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('popularity');

  const fetchCategoryProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const products = await getProductsByCategory(categoryName);
      setAllProducts(products);
    } catch (err: any) {
      console.error(`Error fetching products for category ${categoryName}:`, err);
      if (!isOnline) {
        setError('You are offline. Please check your internet connection.');
      } else {
        setError(err.message || "Failed to load products for this category.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryName) {
      fetchCategoryProducts();
    }
  }, [categoryName]);

  // Auto-reload when coming back online
  useEffect(() => {
    if (isOnline && wasOffline && error) {
      fetchCategoryProducts();
    }
  }, [isOnline, wasOffline, error]);

  const uniqueBrands = useMemo(() => {
    const brands = new Set<string>();
    if (Array.isArray(allProducts)) {
      allProducts.forEach(product => {
        if (product.brand) {
          brands.add(product.brand);
        }
      });
    }
    return Array.from(brands).sort();
  }, [allProducts]);

  useEffect(() => {
    let currentProducts = [...allProducts];

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

    if (selectedBrand) {
      currentProducts = currentProducts.filter(product =>
        product.brand?.toLowerCase() === selectedBrand.toLowerCase()
      );
    }

    if (selectedRating > 0) {
      currentProducts = currentProducts.filter(product =>
        (product.rating || 0) >= selectedRating
      );
    }

    currentProducts.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b._id.localeCompare(a._id);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'popularity':
        default:
          const popularityA = (a.rating || 0) * (a.numReviews || 1);
          const popularityB = (b.rating || 0) * (b.numReviews || 1);
          return popularityB - popularityA;
      }
    });

    setFilteredProducts(currentProducts);
  }, [allProducts, selectedPriceRange, selectedBrand, selectedRating, sortBy]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12 text-[#222222] bg-[#F8F8F8] min-h-screen pb-24">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-8 text-[#222222]">
          Shop {categoryName}
        </h1>
        <div className="flex flex-col justify-center items-center min-h-[200px] bg-white rounded-lg shadow-md p-8">
          <Loader2 className="h-10 w-10 animate-spin text-[#D81E05]" />
          <p className="mt-4 text-lg text-muted-foreground">Loading products for {categoryName}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12 text-[#222222] bg-[#F8F8F8] min-h-screen pb-24">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-8 text-[#222222]">
          Shop {categoryName}
        </h1>
        <div className="flex flex-col justify-center items-center min-h-[200px] bg-white rounded-lg shadow-md p-8">
          {!isOnline ? <WifiOff className="h-10 w-10 text-gray-500" /> : <AlertCircle className="h-10 w-10 text-red-500" />}
          <p className="mt-4 text-lg text-gray-700">{error}</p>
          {isOnline && (
            <Button
              onClick={fetchCategoryProducts}
              className="mt-6 bg-[#D81E05] hover:bg-[#A01A04] text-white"
            >
              Retry
            </Button>
          )}
          {!isOnline && (
            <div className="flex items-center text-gray-500 text-sm mt-4">
              <WifiOff className="h-4 w-4 mr-2" />
              Will automatically retry when connection is restored
            </div>
          )}
        </div>
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
          <li className="flex items-center">
            <Link to="/categories" className="text-[#D81E05] hover:underline text-xs sm:text-sm">Categories</Link>
            <span className="mx-1 sm:mx-2">/</span>
          </li>
          <li className="flex items-center text-gray-800 text-xs sm:text-sm">
            {categoryName}
          </li>
        </ol>
      </nav>

      <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-8 text-[#222222]">
        Shop {categoryName}
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 bg-white p-6 rounded-lg shadow-sm flex-shrink-0 hidden md:block">
          <h2 className="text-xl font-semibold mb-6 text-[#222222]">Filters</h2>

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
              {uniqueBrands.map(brand => (
                <li key={brand}>
                  <button
                    onClick={() => setSelectedBrand(brand)}
                    className={`block text-left hover:text-[#D81E05] transition-colors ${selectedBrand === brand ? 'font-bold text-[#D81E05]' : ''}`}
                  >
                    {brand}
                  </button>
                </li>
              ))}
            </ul>
          </div>

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
                  <StarRating rating={4} /> & Up
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedRating(3)}
                  className={`block text-left hover:text-[#D81E05] transition-colors ${selectedRating === 3 ? 'font-bold text-[#D81E05]' : ''}`}
                >
                  <StarRating rating={3} /> & Up
                </button>
              </li>
            </ul>
          </div>
        </aside>

        <main className="flex-grow">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 p-4 bg-white rounded-lg shadow-sm">
            <p className="text-sm text-gray-600 mb-2 sm:mb-0">
              Showing <span className="font-semibold">{filteredProducts.length}</span> products
            </p>
            <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 w-full sm:w-auto">
              <div className="hidden md:flex items-center gap-2">
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

              <div className="md:hidden grid grid-cols-2 gap-2 w-full">
                <div className="flex items-center gap-2">
                 
                  <select
                    id="price-filter-mobile"
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-[#D81E05] focus:border-[#D81E05] transition-colors flex-grow"
                  >
                    <option value="">All Prices</option>
                    <option value="under-1000">Under KES 1,000</option>
                    <option value="1000-5000">KES 1,000 - 5,000</option>
                    <option value="5000-10000">KES 5,000 - 10,000</option>
                    <option value="over-10000">Over KES 10,000</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
               
                  <select
                    id="brand-filter-mobile"
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-[#D81E05] focus:border-[#D81E05] transition-colors flex-grow"
                  >
                    <option value="">All Brands</option>
                    {uniqueBrands.map(brand => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>

              </div>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <p className="text-center text-lg text-gray-700 bg-white p-8 rounded-lg shadow-sm">
              No products found matching your criteria. Please adjust your filters!
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CategoryPage;