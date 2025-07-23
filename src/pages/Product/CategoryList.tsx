
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ChevronRight } from 'lucide-react';
import { getAllCategories, getProductsByCategory } from '@/services/product-service';

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

const ProductCard = ({ product }) => {
  if (!product) return null;

  const savings = product.originalPrice - product.price;

  return (
    <Link to={`/product/${product.id}`} className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group">
      <div className="relative w-full h-40 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white text-sm font-medium">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-xs mb-2 line-clamp-1">{product.brand}</p>
        <div className="flex items-center gap-1 mb-2">
          <StarRating rating={product.rating} size="w-3 h-3" />
          <span className="text-xs text-gray-500">({product.reviews})</span>
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

const CategoryListPage = () => {
  const [categoriesWithProducts, setCategoriesWithProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        const categories = getAllCategories();
        const categoryData = await Promise.all(
          categories.map(async (categoryName) => {
            const products = getProductsByCategory(categoryName, 3);
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <p className="text-gray-600 text-lg">Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  if (categoriesWithProducts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <p className="text-gray-600 text-lg">No categories found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center lg:text-left">Shop by Category</h1>

      <div className="space-y-12">
        {categoriesWithProducts.map(category => (
          <section key={category.name} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 capitalize">
                {category.name}
              </h2>
              <Link
                to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex items-center text-red-600 hover:text-red-700 font-medium group"
                title={`View all products in ${category.name}`}
              >
                View More
                <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {category.products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 italic">No products available in this category yet.</p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
};

export default CategoryListPage;
