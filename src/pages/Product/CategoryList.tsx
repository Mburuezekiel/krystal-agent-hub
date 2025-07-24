import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, ChevronRight } from "lucide-react";
import {
  getAllCategories,
  getProductsByCategory,
} from "@/services/product-service";

/**
 * StarRating component displays a star rating.
 * @param {object} props - The component props.
 * @param {number} props.rating - The current rating (1-5).
 * @param {string} [props.size="w-4 h-4"] - Tailwind CSS classes for star size.
 */
const StarRating = ({ rating, size = "w-4 h-4" }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size} ${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

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


const ProductCard = ({ product }) => {
  if (!product) return null;

  const savings = product.originalPrice && product.originalPrice > product.price
    ? product.originalPrice - product.price
    : 0;

  return (
    <Link
      to={`/product/${product._id}`}
      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group"
    >
      <div className="relative w-full h-32 sm:h-40 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = `https://placehold.co/128x128/cccccc/333333?text=No+Image`;
            e.currentTarget.onerror = null;
          }}
        />
        {product.stock < 1 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white text-xs sm:text-sm font-medium">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-2 sm:p-3">
        <h3 className="font-semibold text-gray-800 text-xs sm:text-sm mb-0.5 sm:mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-[0.65rem] sm:text-xs mb-1 line-clamp-1">
          {product.brand}
        </p>
        <div className="flex items-center gap-1 mb-1">
          <StarRating rating={Math.round(product.rating || 0)} size="w-3 h-3" />
          <span className="text-[0.6rem] sm:text-xs text-gray-500">({product.numReviews || 0})</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-sm sm:text-base font-bold text-gray-900">
            KES {product.price.toLocaleString()}
          </span>
          {savings > 0 && (
            <span className="text-[0.6rem] sm:text-xs text-gray-500 line-through">
              KES {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

/**
 * CategoryListPage component displays products grouped by category.
 * It fetches categories and a limited number of products for each.
 */
const CategoryListPage = () => {
  const [categoriesWithProducts, setCategoriesWithProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    /**
     * Fetches category data and associated products.
     * Handles loading states and errors.
     */
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
      } catch (err) {
        console.error("Failed to fetch category data:", err);
        setError("Failed to load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 pb-24">
        <p className="text-gray-600 text-lg">Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 pb-24">
        <p className="text-red-600 text-lg">{error}</p>
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