import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Loader2, AlertCircle, WifiOff } from "lucide-react";
import {
  getAllCategories,
  getProductsByCategory,
} from "@/services/product-service";
import { ProductCard } from '@/components/common/ProductCard';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { Button } from '@/components/ui/button';


const formatCategoryNameForLink = (name: string): string => {
  if (!name) return '';

  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('-');
};



/**
 * CategoryListPage component displays products grouped by category.
 * It fetches categories and a limited number of products for each.
 */
const CategoryListPage = () => {
  const [categoriesWithProducts, setCategoriesWithProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isOnline, wasOffline } = useNetworkStatus();

  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      setError(null);

      const categories = await getAllCategories();

      const categoryData = await Promise.all(
        categories.map(async (categoryName) => {
          const products = await getProductsByCategory(categoryName, 4);
          return { name: categoryName, products };
        })
      );
      setCategoriesWithProducts(categoryData);
    } catch (err: any) {
      console.error("Failed to fetch category data:", err);
      if (!isOnline) {
        setError('You are offline. Please check your internet connection.');
      } else {
        setError(err.message || "Failed to load categories. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, []);

  // Auto-reload when coming back online
  useEffect(() => {
    if (isOnline && wasOffline && error) {
      fetchCategoryData();
    }
  }, [isOnline, wasOffline, error]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 pb-24">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#D81E05] mb-4" />
          <p className="text-gray-600 text-lg">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 pb-24">
        <div className="flex flex-col items-center text-center">
          {!isOnline ? <WifiOff className="h-10 w-10 text-gray-500 mb-4" /> : <AlertCircle className="h-10 w-10 text-red-500 mb-4" />}
          <p className="text-red-600 text-lg mb-4">{error}</p>
          {isOnline && (
            <Button
              onClick={fetchCategoryData}
              className="bg-[#D81E05] hover:bg-[#A01A04] text-white"
            >
              Retry
            </Button>
          )}
          {!isOnline && (
            <div className="flex items-center text-gray-500 text-sm">
              <WifiOff className="h-4 w-4 mr-2" />
              Will automatically retry when connection is restored
            </div>
          )}
        </div>
      </div>
    );
  }

  if (categoriesWithProducts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 pb-24">
        <p className="text-gray-600 text-lg">No categories found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen pb-24 font-inter">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center lg:text-left">
        Shop by Category
      </h1>

      <div className="space-y-12">
        {categoriesWithProducts.map((category) => (
          <section
            key={category.name}
            className="bg-white rounded-lg shadow-md p-4 sm:p-6"
          >
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 capitalize">
                {category.name}
              </h2>
              <Link
                to={`/category/${formatCategoryNameForLink(category.name)}`}
                className="flex items-center text-red-600 hover:text-red-700 font-medium group text-sm sm:text-base"
                title={`View all products in ${category.name}`}
              >
                View More
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {category.products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {category.products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 italic text-sm">
                No products available in this category yet.
              </p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
};

export default CategoryListPage;