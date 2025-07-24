import axios from "axios";

export interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  oldPrice?: number;
  isNew?: boolean;
  isTrending?: boolean;
  isPromotional?: boolean;
  description: string;
  brand: string;
  stock: number;
  rating: number;
  numReviews: number;
  images: string[];
  specifications: { [key: string]: string };
  user?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const ALL_CATEGORIES = [
  "New In",
  "Sale",
  "Women Clothing",
  "Beachwear",
  "Kids",
  "Curve",
  "Men Clothing",
  "Shoes",
  "Underwear & Sleepwear",
  "Home & Kitchen",
  "Jewelry & Accessories",
  "Beauty & Health",
  "Baby & Maternity",
  "Bags & Luggage",
  "Sports & Outdoors",
  "Home Textiles",
  "Electronics",
  "Toys & Games",
  "Tools & Home Improvement",
  "Office & School Supplies",
  "Pet Supplies",
  "Appliances",
  "Automotive",
];

const API_URL = "https://krystal-agent-hub.onrender.com/api/products";
const CART_API_URL = "https://krystal-agent-hub.onrender.com/api/cart";
const WISHLIST_API_URL = "https://krystal-agent-hub.onrender.com/api/wishlist";

const getProductsArrayFromResponse = (responseData: any): Product[] => {
  if (responseData && Array.isArray(responseData.products)) {
    return responseData.products;
  }
  if (
    responseData &&
    typeof responseData.products === "object" &&
    responseData.products !== null
  ) {
    if (responseData.products._id) {
      return [responseData.products as Product];
    }
  }
  if (Array.isArray(responseData)) {
    console.warn(
      "Helper: API response was a direct array (not wrapped in 'products')."
    );
    return responseData;
  }
  if (responseData && typeof responseData === "object" && responseData._id) {
    console.warn(
      "Helper: API response was a single product object at root, wrapping in array."
    );
    return [responseData as Product];
  }

  console.error(
    "Helper: API response structure is unexpected for products array:",
    responseData
  );
  return [];
};

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get(API_URL);
    return getProductsArrayFromResponse(response.data);
  } catch (error) {
    console.error("Error fetching all products:", error);
    throw error;
  }
};

export const getProductById = async (
  id: string
): Promise<Product | undefined> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data as Product;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
};

export const getProductsByCategory = async (
  category: string,
  limit?: number
): Promise<Product[]> => {
  try {
    const response = await axios.get(
      `${API_URL}?category=${encodeURIComponent(category)}`
    );
    let products = getProductsArrayFromResponse(response.data);
    return limit ? products.slice(0, limit) : products;
  } catch (error) {
    console.error(`Error fetching products for category "${category}":`, error);
    throw error;
  }
};

export const getNewArrivals = async (limit?: number): Promise<Product[]> => {
  try {
    const response = await axios.get(`${API_URL}?isNew=true`);
    const newProducts = getProductsArrayFromResponse(response.data);
    return limit ? newProducts.slice(0, limit) : newProducts;
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    throw error;
  }
};

export const getTrendingProducts = async (
  limit?: number
): Promise<Product[]> => {
  try {
    const response = await axios.get(`${API_URL}?isTrending=true`);
    const trendingProducts = getProductsArrayFromResponse(response.data);
    return limit ? trendingProducts.slice(0, limit) : trendingProducts;
  } catch (error) {
    console.error("Error fetching trending products:", error);
    throw error;
  }
};

export const getPromotionalProducts = async (
  limit?: number
): Promise<Product[]> => {
  try {
    const response = await axios.get(`${API_URL}?isPromotional=true`);
    const promotionalProducts = getProductsArrayFromResponse(response.data);
    return limit ? promotionalProducts.slice(0, limit) : promotionalProducts;
  } catch (error) {
    console.error("Error fetching promotional products:", error);
    throw error;
  }
};

export const getPersonalizedRecommendations = async (
  userId?: string,
  limit: number = 6
): Promise<Product[]> => {
  try {
    const response = await axios.get(
      `${API_URL}/recommendations?userId=${userId || ""}&limit=${limit}`
    );
    return getProductsArrayFromResponse(response.data);
  } catch (error) {
    console.error("Error fetching personalized recommendations:", error);
    throw error;
  }
};

export const getAllCategories = async (): Promise<string[]> => {
  try {
    const response = await axios.get(API_URL);
    const products = getProductsArrayFromResponse(response.data);
    const categories = [
      ...new Set(products.map((product: Product) => product.category)),
    ];
    return categories.sort();
  } catch (error) {
    console.error("Error fetching all categories:", error);
    throw error;
  }
};

export const createProductApi = async (
  productData: Partial<Product>,
  token: string
): Promise<Product> => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.post(API_URL, productData, config);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const updateProductApi = async (
  id: string,
  productData: Partial<Product>,
  token: string
): Promise<Product> => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.put(`${API_URL}/${id}`, productData, config);
    return response.data;
  } catch (error) {
    console.error(`Error updating product with ID ${id}:`, error);
    throw error;
  }
};

export const deleteProductApi = async (
  id: string,
  token: string
): Promise<void> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios.delete(`${API_URL}/${id}`, config);
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, error);
    throw error;
  }
};

export const reviewProductApi = async (
  id: string,
  reviewData: { rating: number; comment: string },
  token: string
): Promise<Product> => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.put(
      `${API_URL}/${id}/review`,
      reviewData,
      config
    );
    return response.data;
  } catch (error) {
    console.error(`Error reviewing product with ID ${id}:`, error);
    throw error;
  }
};

export const uploadProductImageApi = async (
  id: string,
  imageData: FormData,
  token: string
): Promise<{ imageUrl: string }> => {
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.post(
      `${API_URL}/${id}/upload-image`,
      imageData,
      config
    );
    return response.data;
  } catch (error) {
    console.error(`Error uploading image for product with ID ${id}:`, error);
    throw error;
  }
};

export const addToCartApi = async (
  productId: string,
  quantity: number,
  token: string
): Promise<any> => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.post(
      CART_API_URL,
      { productId, quantity },
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error adding product to cart:", error);
    throw error;
  }
};

export const getCartApi = async (token: string): Promise<any> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(CART_API_URL, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};

export const updateCartItemQuantityApi = async (
  productId: string,
  quantity: number,
  token: string
): Promise<any> => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.put(
      `${CART_API_URL}/${productId}`,
      { quantity },
      config
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error updating quantity for product ${productId} in cart:`,
      error
    );
    throw error;
  }
};

export const removeCartItemApi = async (
  productId: string,
  token: string
): Promise<any> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.delete(`${CART_API_URL}/${productId}`, config);
    return response.data;
  } catch (error) {
    console.error(`Error removing product ${productId} from cart:`, error);
    throw error;
  }
};

export const addToWishlistApi = async (
  productId: string,
  token: string
): Promise<any> => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.post(WISHLIST_API_URL, { productId }, config);
    return response.data;
  } catch (error) {
    console.error("Error adding product to wishlist:", error);
    throw error;
  }
};

export const getWishlistApi = async (token: string): Promise<any> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(WISHLIST_API_URL, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    throw error;
  }
};

export const removeFromWishlistApi = async (
  productId: string,
  token: string
): Promise<any> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.delete(
      `${WISHLIST_API_URL}/${productId}`,
      config
    );
    return response.data;
  } catch (error) {
    console.error(`Error removing product ${productId} from wishlist:`, error);
    throw error;
  }
};
