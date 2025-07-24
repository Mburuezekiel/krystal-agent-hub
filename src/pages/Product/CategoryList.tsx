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
          key={star} // Key for list items
          className={`${size} ${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

/**
 * ProductCard component displays a single product.
 * @param {object} props - The component props.
 * @param {object} props.product - The product object.
 * @param {string} props.product._id - Unique ID of the product.
 * @param {string} props.product.imageUrl - URL of the product image.
 * @param {string} props.product.name - Name of the product.
 * @param {string} props.product.brand - Brand of the product.
 * @param {number} props.product.rating - Rating of the product.
 * @param {number} props.product.reviews - Number of reviews for the product.
 * @param {number} props.product.price - Current price of the product.
 * @param {number} props.product.originalPrice - Original price of the product (for savings).
 * @param {number} props.product.stock - Stock quantity of the product.
 */
const ProductCard = ({ product }) => {
  if (!product) return null;

  // Calculate savings if originalPrice is available and greater than current price
  const savings = product.originalPrice && product.originalPrice > product.price
    ? product.originalPrice - product.price
    : 0;

  return (
    <Link
      to={`/product/${product._id}`} // Link to the product detail page using _id
      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group"
    >
      <div className="relative w-full h-40 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          // Add a fallback for image loading errors
          onError={(e) => {
            e.currentTarget.src = `https://placehold.co/160x160/cccccc/333333?text=No+Image`;
            e.currentTarget.onerror = null; // Prevent infinite loop
          }}
        />
        {product.stock < 1 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white text-sm font-medium">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-xs mb-2 line-clamp-1">
          {product.brand}
        </p>
        <div className="flex items-center gap-1 mb-2">
          {/* Ensure product.rating is a number for StarRating */}
          <StarRating rating={Math.round(product.rating || 0)} size="w-3 h-3" />
          <span className="text-xs text-gray-500">({product.numReviews || 0})</span> {/* Use numReviews from Product interface */}
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-base font-bold text-gray-900">
            KES {product.price.toLocaleString()}
          </span>
          {savings > 0 && (
            <span className="text-xs text-gray-500 line-through">
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
        setError(null); // Clear previous errors

        // Await the result of getAllCategories() to get the actual array of category names
        const categories = await getAllCategories();

        // Use Promise.all to fetch products for all categories concurrently
        const categoryData = await Promise.all(
          categories.map(async (categoryName) => {
            // Await getProductsByCategory as it's an async function
            const products = await getProductsByCategory(categoryName, 3);
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
  }, []); // Empty dependency array means this effect runs once on mount

  // Display loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <p className="text-gray-600 text-lg">Loading categories...</p>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  // Display message if no categories are found after loading
  if (categoriesWithProducts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <p className="text-gray-600 text-lg">No categories found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen font-inter">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center lg:text-left">
        Shop by Category
      </h1>

      <div className="space-y-12">
        {categoriesWithProducts.map((category) => (
          <section
            key={category.name} // Unique key for each category section
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 capitalize">
                {category.name}
              </h2>
              <Link
                to={`/category/${category.name
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`} // Generate URL slug from category name
                className="flex items-center text-red-600 hover:text-red-700 font-medium group"
                title={`View all products in ${category.name}`}
              >
                View More
                <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {category.products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.products.map((product) => (
                  // Use product._id as the unique key for ProductCard components
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 italic">
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
