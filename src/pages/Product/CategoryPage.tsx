import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star } from 'lucide-react'; // Only Star is needed here
import { getProductsByCategory, Product } from '@/services/product-service';
import { Card, CardContent } from '@/components/ui/card';

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

const CategoryPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const categoryName = decodeURIComponent(name || '');
  // Fetch all products for the current category to derive brands and then filter
  const allProducts: Product[] = getProductsByCategory(categoryName);

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('popularity');

  // Dynamically get unique brands from the products in the current category
  const uniqueBrands = useMemo(() => {
    const brands = new Set<string>();
    allProducts.forEach(product => {
      if (product.brand) {
        brands.add(product.brand);
      }
    });
    return Array.from(brands).sort(); // Convert Set to Array and sort alphabetically
  }, [allProducts]); // Recalculate if allProducts changes

  useEffect(() => {
    let currentProducts = [...allProducts];

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

    // Apply Brand Filter
    if (selectedBrand) {
      currentProducts = currentProducts.filter(product =>
        product.brand?.toLowerCase() === selectedBrand.toLowerCase()
      );
    }

    // Apply Rating Filter
    if (selectedRating > 0) {
      currentProducts = currentProducts.filter(product =>
        (product.rating || 0) >= selectedRating
      );
    }

    // Apply Sorting
    currentProducts.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          // Assuming higher ID means newer for mock data; ideally use a timestamp
          return b.id.localeCompare(a.id); // Compare string IDs
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'popularity':
        default:
          // Simple popularity based on rating and number of reviews
          const popularityA = (a.rating * (a.numReviews || 1));
          const popularityB = (b.rating * (b.numReviews || 1));
          return popularityB - popularityA;
      }
    });

    setFilteredProducts(currentProducts);
  }, [allProducts, selectedPriceRange, selectedBrand, selectedRating, sortBy]);


  return (
    <div className="container mx-auto px-4 py-8 md:py-12 text-[#222222] bg-[#F8F8F8] min-h-screen">
      <nav className="text-sm text-gray-600 mb-6">
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center">
            <Link to="/" className="text-[#D81E05] hover:underline">Home</Link>
            <span className="mx-2">/</span>
          </li>
          <li className="flex items-center">
            <Link to="/categories" className="text-[#D81E05] hover:underline">Categories</Link>
            <span className="mx-2">/</span>
          </li>
          <li className="flex items-center text-gray-800">
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

              {/* Mobile Filters (hidden on desktop) */}
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

              <div className="flex items-center gap-2 md:hidden">
                <label htmlFor="brand-filter" className="text-sm text-gray-600">Brand:</label>
                <select
                  id="brand-filter"
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-[#D81E05] focus:border-[#D81E05] transition-colors"
                >
                  <option value="">All Brands</option>
                  {uniqueBrands.map(brand => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

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
                          <span className="absolute top-2 left-2 bg-[#D81E05] text-white text-xs px-2 py-1 rounded-full font-semibold z-10">
                            NEW
                          </span>
                        )}
                      </div>
                      <div className="p-3 text-center flex-grow flex flex-col justify-between">
                        <h3 className="text-sm font-medium text-[#222222] mb-1 line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex flex-col items-center justify-center gap-1 mt-2">
                          {/* Only show oldPrice if it's defined and greater than 0 */}
                          {product.oldPrice !== undefined && product.oldPrice > 0 && (
                            <p className="text-xs text-gray-500 line-through">
                              KES {product.oldPrice.toLocaleString()}
                            </p>
                          )}
                          <p className="text-base font-bold text-[#D81E05]">
                            KES {product.price.toLocaleString()}
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
