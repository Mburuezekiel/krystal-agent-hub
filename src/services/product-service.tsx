// src/services/product-service.tsx

// Define the Product interface for type safety
export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string; // Added category for filtering
  oldPrice?: number;
  isNew?: boolean;
  isTrending?: boolean; // For trending section
  isPromotional?: boolean; // For promotions section
}

// Full list of categories as provided by the user
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


// Dummy Product Data
const DUMMY_PRODUCTS: Product[] = [
  // New In / Women Clothing
  { id: 'p1', name: 'Elegant Red Maxi Dress', price: 4500, imageUrl: 'https://placehold.co/400x500/D81E05/FFFFFF?text=Red+Maxi+Dress', category: 'Women Clothing', isNew: true },
  { id: 'p2', name: 'Trendy Black Crop Top', price: 1200, imageUrl: 'https://placehold.co/400x500/222222/FFFFFF?text=Black+Crop+Top', category: 'Women Clothing', isNew: true, isTrending: true },
  { id: 'p3', name: 'High-Waist Denim Jeans', price: 3200, imageUrl: 'https://placehold.co/400x500/F8F8F8/222222?text=Denim+Jeans', category: 'Women Clothing', isNew: true },
  { id: 'p4', name: 'Boho Beach Cover-Up', price: 2800, imageUrl: 'https://placehold.co/400x500/FFD700/222222?text=Beach+Cover', category: 'Beachwear', isNew: true },

  // Sale / Women Clothing
  { id: 'p5', name: 'Classic Black Heels', price: 2800, oldPrice: 4000, imageUrl: 'https://placehold.co/400x500/222222/FFFFFF?text=Black+Heels', category: 'Shoes', isPromotional: true },
  { id: 'p6', name: 'Summer Floral Blouse', price: 1500, oldPrice: 2000, imageUrl: 'https://placehold.co/400x500/F8F8F8/222222?text=Floral+Blouse', category: 'Women Clothing', isPromotional: true },

  // Kids
  { id: 'p7', name: 'Kids Dino T-Shirt', price: 950, imageUrl: 'https://placehold.co/400x500/D81E05/FFFFFF?text=Dino+T-Shirt', category: 'Kids', isNew: true },
  { id: 'p8', name: 'Unicorn Backpack', price: 1800, imageUrl: 'https://placehold.co/400x500/FFD700/222222?text=Unicorn+Backpack', category: 'Kids' },

  // Men Clothing
  { id: 'p9', name: 'Men\'s Casual Polo Shirt', price: 2100, imageUrl: 'https://placehold.co/400x500/222222/FFFFFF?text=Polo+Shirt', category: 'Men Clothing', isTrending: true },
  { id: 'p10', name: 'Slim Fit Chinos', price: 3500, imageUrl: 'https://placehold.co/400x500/F8F8F8/222222?text=Chinos', category: 'Men Clothing' },

  // Home & Kitchen
  { id: 'p11', name: 'Smart Coffee Maker', price: 8900, imageUrl: 'https://placehold.co/400x500/D81E05/FFFFFF?text=Coffee+Maker', category: 'Home & Kitchen', isNew: true },
  { id: 'p12', name: 'Non-Stick Frying Pan Set', price: 4200, imageUrl: 'https://placehold.co/400x500/222222/FFFFFF?text=Frying+Pans', category: 'Home & Kitchen' },

  // Jewelry & Accessories
  { id: 'p13', name: 'Minimalist Silver Necklace', price: 1600, imageUrl: 'https://placehold.co/400x500/F8F8F8/222222?text=Silver+Necklace', category: 'Jewelry & Accessories', isTrending: true },
  { id: 'p14', name: 'Leather Wallet', price: 2500, imageUrl: 'https://placehold.co/400x500/FFD700/222222?text=Leather+Wallet', category: 'Jewelry & Accessories' },

  // Electronics
  { id: 'p15', name: 'Wireless Bluetooth Earbuds', price: 5800, imageUrl: 'https://placehold.co/400x500/D81E05/FFFFFF?text=Earbuds', category: 'Electronics', isNew: true },
  { id: 'p16', name: 'Portable Power Bank', price: 2900, imageUrl: 'https://placehold.co/400x500/222222/FFFFFF?text=Power+Bank', category: 'Electronics' },

  // Sports & Outdoors
  { id: 'p17', name: 'Yoga Mat with Carry Strap', price: 1900, imageUrl: 'https://placehold.co/400x500/F8F8F8/222222?text=Yoga+Mat', category: 'Sports & Outdoors' },
  { id: 'p18', name: 'Waterproof Hiking Backpack', price: 6500, imageUrl: 'https://placehold.co/400x500/FFD700/222222?text=Hiking+Pack', category: 'Sports & Outdoors' },

  // Home Textiles
  { id: 'p19', name: 'Luxury Cotton Bedding Set', price: 7200, imageUrl: 'https://placehold.co/400x500/D81E05/FFFFFF?text=Bedding+Set', category: 'Home Textiles' },

  // Toys & Games
  { id: 'p20', name: 'Educational Building Blocks', price: 1400, imageUrl: 'https://placehold.co/400x500/222222/FFFFFF?text=Building+Blocks', category: 'Toys & Games' },

  // Beauty & Health
  { id: 'p21', name: 'Organic Face Serum', price: 2700, imageUrl: 'https://placehold.co/400x500/F8F8F8/222222?text=Face+Serum', category: 'Beauty & Health' },

  // Baby & Maternity
  { id: 'p22', name: 'Baby Swaddle Blanket', price: 1100, imageUrl: 'https://placehold.co/400x500/FFD700/222222?text=Swaddle', category: 'Baby & Maternity' },

  // Office & School Supplies
  { id: 'p23', name: 'Ergonomic Office Chair', price: 12000, imageUrl: 'https://placehold.co/400x500/D81E05/FFFFFF?text=Office+Chair', category: 'Office & School Supplies' },

  // Pet Supplies
  { id: 'p24', name: 'Automatic Pet Feeder', price: 4800, imageUrl: 'https://placehold.co/400x500/222222/FFFFFF?text=Pet+Feeder', category: 'Pet Supplies' },

  // Appliances
  { id: 'p25', name: 'Compact Air Fryer', price: 6700, imageUrl: 'https://placehold.co/400x500/F8F8F8/222222?text=Air+Fryer', category: 'Appliances', isPromotional: true },

  // Automotive
  { id: 'p26', name: 'Car Dash Camera', price: 5500, imageUrl: 'https://placehold.co/400x500/FFD700/222222?text=Dash+Cam', category: 'Automotive' },

  // More clothing for variety
  { id: 'p27', name: 'Striped Oversized Shirt', price: 1900, imageUrl: 'https://placehold.co/400x500/D81E05/FFFFFF?text=Striped+Shirt', category: 'Men Clothing', isNew: true },
  { id: 'p28', name: 'Elegant Evening Gown', price: 7800, imageUrl: 'https://placehold.co/400x500/222222/FFFFFF?text=Evening+Gown', category: 'Women Clothing', isTrending: true },
  { id: 'p29', name: 'Sporty Running Shoes', price: 4100, imageUrl: 'https://placehold.co/400x500/F8F8F8/222222?text=Running+Shoes', category: 'Shoes', isPromotional: true },
  { id: 'p30', name: 'Kids Winter Jacket', price: 2900, imageUrl: 'https://placehold.co/400x500/FFD700/222222?text=Winter+Jacket', category: 'Kids' },
];

// Functions to retrieve dummy product data
export const getAllProducts = (): Product[] => {
  return DUMMY_PRODUCTS;
};

export const getProductById = (id: string): Product | undefined => {
  return DUMMY_PRODUCTS.find(product => product.id === id);
};

export const getNewArrivals = (limit?: number): Product[] => {
  const newProducts = DUMMY_PRODUCTS.filter(product => product.isNew);
  return limit ? newProducts.slice(0, limit) : newProducts;
};

export const getTrendingProducts = (limit?: number): Product[] => {
  const trending = DUMMY_PRODUCTS.filter(product => product.isTrending);
  return limit ? trending.slice(0, limit) : trending;
};

export const getPromotionalProducts = (limit?: number): Product[] => {
  const promotions = DUMMY_PRODUCTS.filter(product => product.isPromotional);
  return limit ? promotions.slice(0, limit) : promotions;
};

export const getProductsByCategory = (category: string, limit?: number): Product[] => {
  const filteredProducts = DUMMY_PRODUCTS.filter(product =>
    product.category.toLowerCase() === category.toLowerCase()
  );
  return limit ? filteredProducts.slice(0, limit) : filteredProducts;
};

// A simple "personalized" recommendation logic for dummy data
export const getPersonalizedRecommendations = (userId?: string, limit: number = 6): Product[] => {
  // In a real app, this would use user browsing history, purchase data, etc.
  // For dummy data, we'll just return a random subset or trending items.
  const allAvailable = DUMMY_PRODUCTS.filter(p => !p.isNew && !p.isPromotional);
  const shuffled = allAvailable.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, limit);
};

