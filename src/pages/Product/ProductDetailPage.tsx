import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import { getProductById, getProductsByCategory, Product } from '@/services/product-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Share2 } from 'lucide-react';

interface DetailedProduct extends Product {
  description: string;
  brand: string;
  stock: number;
  rating: number;
  numReviews: number;
  images: string[];
  specifications: { [key: string]: string };
}

const addProductToWishlist = (product: Product) => {
  const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
  if (!wishlist.some((item: Product) => item.id === product.id)) {
    wishlist.push(product);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    return true;
  }
  return false;
};

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product: DetailedProduct | undefined = getProductById(id || '') as DetailedProduct;

  const [mainImage, setMainImage] = useState<string>(product?.imageUrl || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (product) {
      setMainImage(product.imageUrl);
      setQuantity(1);
      const productsInSameCategory = getProductsByCategory(product.category);
      const filteredRelated = productsInSameCategory
        .filter(p => p.id !== product.id && p.brand !== product.brand)
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);

      if (filteredRelated.length < 5) {
        const allOtherProducts = getProductsByCategory(product.category)
          .filter(p => p.id !== product.id && !filteredRelated.some(fp => fp.id === p.id))
          .sort(() => 0.5 - Math.random());
        filteredRelated.push(...allOtherProducts.slice(0, 5 - filteredRelated.length));
      }

      setRelatedProducts(filteredRelated);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-[#222222] bg-[#F8F8F8] min-h-[60vh] flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
        <p className="text-lg">The product you are looking for does not exist.</p>
        <Button asChild className="mt-6 bg-[#D81E05] hover:bg-[#A01A04] text-white rounded-full px-8 py-3 text-lg font-semibold">
          <Link to="/">Go to Homepage</Link>
        </Button>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-5 h-5 ${i <= Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
        </svg>
      );
    }
    return <div className="flex">{stars}</div>;
  };

  const handleAddToWishlist = () => {
    if (addProductToWishlist(product)) {
      alert(`"${product.name}" added to your wishlist!`);
    } else {
      alert(`"${product.name}" is already in your wishlist!`);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `${product.name} - KES ${product.price.toFixed(2)}: ${product.description.substring(0, 100)}...`,
          url: window.location.href,
        });
        console.log('Product shared successfully');
      } catch (error) {
        console.error('Error sharing product:', error);
        alert('Could not share product. Please try again.');
      }
    } else {
      const shareText = `${product.name} - KES ${product.price.toFixed(2)}: ${product.description.substring(0, 100)}... ${window.location.href}`;
      navigator.clipboard.writeText(shareText)
        .then(() => alert('Product link and details copied to clipboard!'))
        .catch(() => alert('Could not copy to clipboard.'));
    }
  };

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
          <li className="flex items-center">
            <Link to={`/category/${encodeURIComponent(product.category)}`} className="text-[#D81E05] hover:underline">
              {product.category}
            </Link>
            <span className="mx-2">/</span>
          </li>
          <li className="flex items-center text-gray-800">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="bg-white rounded-lg shadow-md p-6 md:p-8 flex flex-col md:flex-row gap-8 lg:gap-12">
        <div className="md:w-1/2 flex flex-col items-center">
          <div className="w-full max-w-md aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 shadow-sm">
            <img
              src={mainImage || product.imageUrl}
              alt={product.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = `https://placehold.co/600x600/E0E0E0/666666?text=Image+Error`;
                e.currentTarget.onerror = null;
              }}
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 justify-center flex-wrap">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setMainImage(img)}
                  className={`w-16 h-16 rounded-md overflow-hidden border-2 ${mainImage === img ? 'border-[#D81E05]' : 'border-gray-200'} hover:border-[#D81E05] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#D81E05]`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://placehold.co/64x64/F0F0F0/999999?text=X`;
                      e.currentTarget.onerror = null;
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="md:w-1/2">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-[#222222]">{product.name}</h1>

          {product.rating !== undefined && product.numReviews !== undefined && (
            <div className="flex items-center mb-4">
              {renderStars(product.rating)}
              <span className="text-sm text-gray-600 ml-2">({product.numReviews} reviews)</span>
            </div>
          )}

          <div className="flex items-baseline gap-2 mb-4">
            <p className="text-3xl font-bold text-[#D81E05]">KES {product.price.toFixed(2)}</p>
            {product.oldPrice && (
              <p className="text-lg text-gray-500 line-through">KES {product.oldPrice.toFixed(2)}</p>
            )}
          </div>

          {product.stock !== undefined && (
            <p className={`text-sm font-semibold mb-4 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </p>
          )}

          <p className="text-gray-700 text-sm mb-2">
            <span className="font-semibold">Brand:</span> {product.brand || 'N/A'}
          </p>
          <p className="text-gray-700 text-sm mb-6">
            <span className="font-semibold">Category:</span> {product.category}
          </p>

          <div className="flex items-center gap-4 mb-6">
            <label htmlFor="quantity" className="text-lg font-semibold text-[#222222]">Quantity:</label>
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="px-3 py-1 text-lg font-semibold text-gray-700 hover:bg-gray-100 rounded-l-md"
              >
                -
              </button>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-16 text-center border-x border-gray-300 py-1 text-lg"
                min="1"
                max={product.stock || 99}
              />
              <button
                onClick={() => setQuantity(prev => (product.stock && prev >= product.stock) ? prev : prev + 1)}
                className="px-3 py-1 text-lg font-semibold text-gray-700 hover:bg-gray-100 rounded-r-md"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Button
              className="bg-[#D81E05] hover:bg-[#A01A04] text-white rounded-full px-8 py-3 text-lg font-semibold flex-grow transition-colors duration-200"
              disabled={product.stock !== undefined && product.stock <= 0}
            >
              {product.stock !== undefined && product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
            <Button
              onClick={handleAddToWishlist}
              className="bg-gray-200 hover:bg-gray-300 text-[#D81E05] rounded-full px-4 py-3 text-lg font-semibold flex items-center justify-center gap-2 transition-colors duration-200"
              aria-label="Add to Wishlist"
            >
              <Heart />
              <span className="hidden sm:inline">Wishlist</span>
            </Button>
            <Button
              onClick={handleShare}
              className="bg-gray-200 hover:bg-gray-300 text-[#222222] rounded-full px-4 py-3 text-lg font-semibold flex items-center justify-center gap-2 transition-colors duration-200"
              aria-label="Share Product"
            >
              <Share2 />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-xl font-semibold mb-4 text-[#222222]">Delivery & Returns</h3>
            <div className="space-y-3 text-gray-700 text-sm">
              <p>
                <span className="font-medium">Estimated Delivery:</span> 3-5 business days.
              </p>
              <p>
                <span className="font-medium">Return Policy:</span> 30-day free returns. See our full policy for details.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mt-8">
        <h2 className="text-2xl font-bold mb-4 text-[#222222]">Product Details</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          {product.description || 'This is a detailed description of the product, highlighting its key features, benefits, and usage instructions. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'}
        </p>

        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <>
            <h3 className="text-xl font-semibold mb-3 text-[#222222]">Specifications</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              {Object.entries(product.specifications).map(([key, value]) => (
                <li key={key}>
                  <span className="font-medium">{key}:</span> {value}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-[#222222]">You Might Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {relatedProducts.map((relatedProduct) => (
              <Link to={`/product/${relatedProduct.id}`} key={relatedProduct.id} className="group block">
                <Card className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
                  <CardContent className="p-0">
                    <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                      <img
                        src={relatedProduct.imageUrl}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = `https://placehold.co/400x400/E0E0E0/666666?text=Image+Error`;
                          e.currentTarget.onerror = null;
                        }}
                      />
                      {relatedProduct.isNew && (
                        <span className="absolute top-2 left-2 bg-[#D81E05] text-white text-xs px-2 py-1 rounded-full font-semibold">NEW</span>
                      )}
                    </div>
                    <div className="p-3 text-center">
                      <h3 className="text-sm font-medium text-[#222222] mb-1 line-clamp-2">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-center justify-center gap-2">
                        {relatedProduct.oldPrice && (
                          <p className="text-xs text-gray-500 line-through">
                            KES {relatedProduct.oldPrice.toFixed(2)}</p>
                        )}
                        <p className="text-base font-semibold text-[#D81E05]">
                          KES {relatedProduct.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
