// src/services/product-service.tsx

// Define the Product interface for type safety
export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  oldPrice?: number;
  isNew?: boolean;
  isTrending?: boolean;
  isPromotional?: boolean;
  // New fields for detailed product page
  description: string;
  brand: string; // Made mandatory for better filtering demonstration
  stock: number;
  rating: number; // Average rating (e.g., 4.5)
  numReviews: number; // Number of reviews
  images: string[]; // Array of image URLs for gallery
  specifications: { [key: string]: string }; // Key-value pairs for specs
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
  // Women Clothing (Category: Women Clothing) - 3+ items
  {
    id: 'p1', name: ' Red Maxi Dress', price: 4500, oldPrice: 5000,
    imageUrl: 'https://placehold.co/400x500/D81E05/FFFFFF?text=Red+Maxi+Dress', category: 'Women Clothing', isNew: true,
    description: 'A stunning elegant red maxi dress perfect for evening events and special occasions. Made from high-quality, breathable fabric for ultimate comfort and style.',
    brand: 'Fashionista', stock: 15, rating: 4.7, numReviews: 120,
    images: [
      'https://placehold.co/400x500/D81E05/FFFFFF?text=Red+Maxi+Dress',
      'https://placehold.co/400x500/A01A04/FFFFFF?text=Dress+View+2',
      'https://placehold.co/400x500/6A0D00/FFFFFF?text=Dress+View+3'
    ],
    specifications: { "Material": "Polyester Blend", "Style": "Maxi", "Occasion": "Evening" }
  },
  {
    id: 'p2', name: 'Trendy Black Crop Top', price: 1200,
    imageUrl: 'https://placehold.co/400x500/222222/FFFFFF?text=Black+Crop+Top', category: 'Women Clothing',  isTrending: true,
    description: 'A versatile black crop top, ideal for casual wear or dressing up. Features a comfortable fit and modern design.',
    brand: 'UrbanStyle', stock: 50, rating: 4.5, numReviews: 200,
    images: [
      'https://placehold.co/400x500/222222/FFFFFF?text=Black+Crop+Top',
      'https://placehold.co/400x500/444444/FFFFFF?text=Crop+Top+View+2'
    ],
    specifications: { "Material": "Cotton", "Sleeve Style": "Short Sleeve", "Fit": "Slim" }
  },
  {
    id: 'p3', name: 'High-Waist Denim Jeans', price: 3200, oldPrice: 3800,
    imageUrl: 'https://placehold.co/400x500/F8F8F8/222222?text=Denim+Jeans', category: 'Women Clothing',
    description: 'Comfortable and stylish high-waist denim jeans, perfect for everyday wear. Durable fabric with a flattering fit.',
    brand: 'DenimCo', stock: 30, rating: 4.6, numReviews: 150,
    images: [
      'https://placehold.co/400x500/F8F8F8/222222?text=Denim+Jeans',
      'https://placehold.co/400x500/D0D0D0/222222?text=Jeans+View+2'
    ],
    specifications: { "Material": "Cotton Denim", "Waist": "High-Waist", "Fit": "Skinny" }
  },
  {
    id: 'p28', name: 'Elegant Evening Gown', price: 7800, oldPrice: 9000,
    imageUrl: 'https://placehold.co/400x500/222222/FFFFFF?text=Evening+Gown', category: 'Women Clothing', isTrending: true,
    description: 'A sophisticated evening gown designed for elegance and comfort. Features intricate detailing and a flowing silhouette.',
    brand: 'GlamourWear', stock: 8, rating: 4.8, numReviews: 90,
    images: [
      'https://placehold.co/400x500/222222/FFFFFF?text=Evening+Gown',
      'https://placehold.co/400x500/444444/FFFFFF?text=Gown+View+2'
    ],
    specifications: { "Material": "Silk Blend", "Length": "Floor-Length", "Closure": "Zipper" }
  },

  // Beachwear (Category: Beachwear) - 3+ items
  {
    id: 'p4', name: 'Boho Beach Cover-Up', price: 2800,
    imageUrl: 'https://placehold.co/400x500/FFD700/222222?text=Beach+Cover', category: 'Beachwear', 
    description: 'Lightweight and stylish boho beach cover-up, perfect for your next vacation. Quick-drying fabric.',
    brand: 'SunKissed', stock: 25, rating: 4.4, numReviews: 80,
    images: [
      'https://placehold.co/400x500/FFD700/222222?text=Beach+Cover',
      'https://placehold.co/400x500/FFA500/222222?text=Cover+View+2'
    ],
    specifications: { "Material": "Rayon", "Style": "Bohemian", "Feature": "Quick Dry" }
  },
  {
    id: 'p31', name: 'Tropical Print Bikini Set', price: 3500,
    imageUrl: 'https://placehold.co/400x500/00BFFF/FFFFFF?text=Tropical+Bikini', category: 'Beachwear',
    description: 'Vibrant tropical print bikini set, designed for comfort and style on the beach or by the pool.',
    brand: 'AquaChic', stock: 20, rating: 4.6, numReviews: 110,
    images: [
      'https://placehold.co/400x500/00BFFF/FFFFFF?text=Tropical+Bikini',
      'https://placehold.co/400x500/0080FF/FFFFFF?text=Bikini+View+2'
    ],
    specifications: { "Material": "Nylon/Spandex", "Pattern": "Floral", "Fit": "Regular" }
  },
  {
    id: 'p32', name: 'Men\'s Quick-Dry Swim Trunks', price: 1800,
    imageUrl: 'https://placehold.co/400x500/008000/FFFFFF?text=Swim+Trunks', category: 'Beachwear',
    description: 'Comfortable and quick-drying swim trunks for men, ideal for swimming and beach activities.',
    brand: 'OceanWave', stock: 40, rating: 4.3, numReviews: 75,
    images: [
      'https://placehold.co/400x500/008000/FFFFFF?text=Swim+Trunks',
      'https://placehold.co/400x500/006400/FFFFFF?text=Trunks+View+2'
    ],
    specifications: { "Material": "Polyester", "Length": "Mid-Thigh", "Feature": "Quick Dry" }
  },

  // Shoes (Category: Shoes) - 3+ items
  {
    id: 'p5', name: 'Classic Black Heels', price: 2800, oldPrice: 4000,
    imageUrl: 'https://placehold.co/400x500/222222/FFFFFF?text=Black+Heels', category: 'Shoes', isPromotional: true,
    description: 'Timeless classic black heels, perfect for formal occasions or professional settings. Comfortable and elegant design.',
    brand: 'StilettoPro', stock: 10, rating: 4.5, numReviews: 95,
    images: [
      'https://placehold.co/400x500/222222/FFFFFF?text=Black+Heels',
      'https://placehold.co/400x500/444444/FFFFFF?text=Heels+View+2'
    ],
    specifications: { "Material": "PU Leather", "Heel Height": "3 inch", "Closure": "Slip-on" }
  },
  {
    id: 'p29', name: 'Sporty Running Shoes', price: 4100, oldPrice: 5000,
    imageUrl: 'https://placehold.co/400x500/F8F8F8/222222?text=Running+Shoes', category: 'Shoes', isPromotional: true,
    description: 'Lightweight and comfortable running shoes, designed for optimal performance and support during your workouts.',
    brand: 'StrideMax', stock: 25, rating: 4.7, numReviews: 180,
    images: [
      'https://placehold.co/400x500/F8F8F8/222222?text=Running+Shoes',
      'https://placehold.co/400x500/D0D0D0/222222?text=Shoes+View+2'
    ],
    specifications: { "Material": "Mesh/Rubber", "Sole": "EVA", "Feature": "Breathable" }
  },
  {
    id: 'p33', name: 'Men\'s Leather Loafers', price: 6200,
    imageUrl: 'https://placehold.co/400x500/8B4513/FFFFFF?text=Leather+Loafers', category: 'Shoes',
    description: 'Premium leather loafers for men, offering both comfort and a sophisticated look for casual or semi-formal wear.',
    brand: 'GentleStep', stock: 18, rating: 4.6, numReviews: 60,
    images: [
      'https://placehold.co/400x500/8B4513/FFFFFF?text=Leather+Loafers',
      'https://placehold.co/400x500/A0522D/FFFFFF?text=Loafers+View+2'
    ],
    specifications: { "Material": "Genuine Leather", "Style": "Slip-on", "Occasion": "Casual" }
  },

  // Kids (Category: Kids) - 3+ items
  {
    id: 'p7', name: 'Kids Dino T-Shirt', price: 950,oldPrice: 1000,
    imageUrl: 'https://placehold.co/400x500/D81E05/FFFFFF?text=Dino+T-Shirt', category: 'Kids', isNew: true,
    description: 'Fun and colorful dino print t-shirt for kids. Made from soft, comfortable cotton for active play.',
    brand: 'PlayWear', stock: 60, rating: 4.8, numReviews: 250,
    images: [
      'https://placehold.co/400x500/D81E05/FFFFFF?text=Dino+T-Shirt',
      'https://placehold.co/400x500/A01A04/FFFFFF?text=Dino+T-Shirt+View+2'
    ],
    specifications: { "Material": "100% Cotton", "Sleeve Style": "Short Sleeve", "Age Group": "2-7 Years" }
  },
  {
    id: 'p8', name: 'Unicorn Backpack', price: 1800,
    imageUrl: 'https://placehold.co/400x500/FFD700/222222?text=Unicorn+Backpack', category: 'Kids',
    description: 'Sparkly unicorn backpack with ample space for school supplies and toys. Durable and eye-catching design.',
    brand: 'MagicKids', stock: 35, rating: 4.7, numReviews: 130,
    images: [
      'https://placehold.co/400x500/FFD700/222222?text=Unicorn+Backpack',
      'https://placehold.co/400x500/FFA500/222222?text=Backpack+View+2'
    ],
    specifications: { "Material": "Polyester", "Capacity": "15L", "Feature": "Adjustable Straps" }
  },
  {
    id: 'p30', name: 'Kids Winter Jacket', price: 2900, oldPrice: 3500,
    imageUrl: 'https://placehold.co/400x500/FFD700/222222?text=Winter+Jacket', category: 'Kids',
    description: 'Warm and cozy winter jacket for kids, designed to keep them comfortable in cold weather. Water-resistant outer shell.',
    brand: 'SnowKids', stock: 20, rating: 4.5, numReviews: 90,
    images: [
      'https://placehold.co/400x500/FFD700/222222?text=Winter+Jacket',
      'https://placehold.co/400x500/FFA500/222222?text=Jacket+View+2'
    ],
    specifications: { "Material": "Polyester", "Insulation": "Fleece Lined", "Feature": "Water Resistant" }
  },

  // Men Clothing (Category: Men Clothing) - 3+ items
  {
    id: 'p9', name: 'Men\'s Casual Polo Shirt', price: 2100,
    imageUrl: 'https://placehold.co/400x500/222222/FFFFFF?text=Polo+Shirt', category: 'Men Clothing', isTrending: true,
    description: 'A classic casual polo shirt for men, perfect for everyday wear. Soft fabric and a comfortable fit.',
    brand: 'GentlemanCo', stock: 40, rating: 4.4, numReviews: 160,
    images: [
      'https://placehold.co/400x500/222222/FFFFFF?text=Polo+Shirt',
      'https://placehold.co/400x500/444444/FFFFFF?text=Polo+Shirt+View+2'
    ],
    specifications: { "Material": "Pique Cotton", "Collar": "Fold-down", "Sleeve": "Short" }
  },
  {
    id: 'p10', name: 'Slim Fit Chinos', price: 3500,
    imageUrl: 'https://placehold.co/400x500/F8F8F8/222222?text=Chinos', category: 'Men Clothing',
    description: 'Stylish slim fit chinos for men, offering a modern look and comfortable feel. Versatile for various occasions.',
    brand: 'TailoredMan', stock: 30, rating: 4.5, numReviews: 100,
    images: [
      'https://placehold.co/400x500/F8F8F8/222222?text=Chinos',
      'https://placehold.co/400x500/D0D0D0/222222?text=Chinos+View+2'
    ],
    specifications: { "Material": "Cotton Blend", "Fit": "Slim", "Closure": "Button Fly" }
  },
  {
    id: 'p27', name: 'Striped Oversized Shirt', price: 1900,
    imageUrl: 'https://placehold.co/400x500/D81E05/FFFFFF?text=Striped+Shirt', category: 'Men Clothing',
    description: 'Relaxed fit striped shirt for men, offering a trendy oversized look. Made from soft, breathable fabric.',
    brand: 'CasualVibe', stock: 22, rating: 4.3, numReviews: 70,
    images: [
      'https://placehold.co/400x500/D81E05/FFFFFF?text=Striped+Shirt',
      'https://placehold.co/400x500/A01A04/FFFFFF?text=Shirt+View+2'
    ],
    specifications: { "Material": "Cotton", "Style": "Oversized", "Pattern": "Striped" }
  },

  // Home & Kitchen (Category: Home & Kitchen) - 3+ items
  {
    id: 'p11', name: 'Smart Coffee Maker', price: 8900,oldPrice: 9999,
    imageUrl: 'https://placehold.co/400x500/D81E05/FFFFFF?text=Coffee+Maker', category: 'Home & Kitchen', isNew: true,
    description: 'Programmable smart coffee maker with various brewing options. Features a sleek design and easy-to-use controls.',
    brand: 'BrewMaster', stock: 12, rating: 4.9, numReviews: 300,
    images: [
      'https://placehold.co/400x500/D81E05/FFFFFF?text=Coffee+Maker',
      'https://placehold.co/400x500/A01A04/FFFFFF?text=Coffee+Maker+View+2'
    ],
    specifications: { "Capacity": "12 Cups", "Feature": "Programmable", "Material": "Stainless Steel" }
  },
  {
    id: 'p12', name: 'Non-Stick Frying Pan Set', price: 4200, oldPrice: 5000,
    imageUrl: 'https://placehold.co/400x500/222222/FFFFFF?text=Frying+Pans', category: 'Home & Kitchen',
    description: 'Durable non-stick frying pan set, essential for every kitchen. Even heat distribution and easy to clean.',
    brand: 'CookPro', stock: 20, rating: 4.6, numReviews: 180,
    images: [
      'https://placehold.co/400x500/222222/FFFFFF?text=Frying+Pans',
      'https://placehold.co/400x500/444444/FFFFFF?text=Pans+View+2'
    ],
    specifications: { "Material": "Aluminum", "Coating": "Non-Stick", "Pieces": "3" }
  },
  {
    id: 'p34', name: 'Digital Kitchen Scale', price: 1500,
    imageUrl: 'https://placehold.co/400x500/F8F8F8/222222?text=Kitchen+Scale', category: 'Home & Kitchen',
    description: 'Accurate digital kitchen scale for precise measurements. Features a large display and tare function.',
    brand: 'MeasureRight', stock: 35, rating: 4.7, numReviews: 100,
    images: [
      'https://placehold.co/400x500/F8F8F8/222222?text=Kitchen+Scale',
      'https://placehold.co/400x500/D0D0D0/222222?text=Scale+View+2'
    ],
    specifications: { "Capacity": "5kg", "Accuracy": "1g", "Display": "LCD" }
  },

  // Electronics (Category: Electronics) - 3+ items
  {
    id: 'p15', name: 'Wireless Bluetooth Earbuds', price: 5800, oldPrice: 7000,
    imageUrl: 'https://placehold.co/400x500/D81E05/FFFFFF?text=Earbuds', category: 'Electronics', isNew: true,
    description: 'High-fidelity wireless Bluetooth earbuds with noise cancellation. Perfect for music, calls, and workouts.',
    brand: 'SoundWave', stock: 45, rating: 4.8, numReviews: 400,
    images: [
      'https://placehold.co/400x500/D81E05/FFFFFF?text=Earbuds',
      'https://placehold.co/400x500/A01A04/FFFFFF?text=Earbuds+View+2'
    ],
    specifications: { "Connectivity": "Bluetooth 5.0", "Battery Life": "8 hours", "Feature": "Noise Cancelling" }
  },
  {
    id: 'p16', name: 'Portable Power Bank', price: 2900,
    imageUrl: 'https://placehold.co/400x500/222222/FFFFFF?text=Power+Bank', category: 'Electronics',
    description: 'Compact and powerful portable power bank for on-the-go charging. Compatible with most smartphones and tablets.',
    brand: 'ChargeFast', stock: 70, rating: 4.6, numReviews: 280,
    images: [
      'https://placehold.co/400x500/222222/FFFFFF?text=Power+Bank',
      'https://placehold.co/400x500/444444/FFFFFF?text=Power+Bank+View+2'
    ],
    specifications: { "Capacity": "10000mAh", "Ports": "USB-A, USB-C", "Feature": "Fast Charging" }
  },
  {
    id: 'p35', name: 'Smart LED TV 55-inch', price: 45000, oldPrice: 55000,
    imageUrl: 'https://placehold.co/400x500/0000FF/FFFFFF?text=Smart+TV', category: 'Electronics', isPromotional: true,
    description: 'Immersive 4K Smart LED TV with vibrant colors and smart features. Enjoy your favorite content in stunning clarity.',
    brand: 'VisionTech', stock: 8, rating: 4.9, numReviews: 150,
    images: [
      'https://placehold.co/400x500/0000FF/FFFFFF?text=Smart+TV',
      'https://placehold.co/400x500/0000AA/FFFFFF?text=TV+View+2'
    ],
    specifications: { "Screen Size": "55 inch", "Resolution": "4K UHD", "Smart Features": "Yes" }
  },

  // Sports & Outdoors (Category: Sports & Outdoors) - 3+ items
  {
    id: 'p17', name: 'Yoga Mat with Carry Strap', price: 1900,oldPrice: 2000,
    imageUrl: 'https://placehold.co/400x500/F8F8F8/222222?text=Yoga+Mat', category: 'Sports & Outdoors',isNew: true,
    description: 'Eco-friendly yoga mat with excellent grip and cushioning. Includes a convenient carry strap for portability.',
    brand: 'ZenFit', stock: 30, rating: 4.7, numReviews: 110,
    images: [
      'https://placehold.co/400x500/F8F8F8/222222?text=Yoga+Mat',
      'https://placehold.co/400x500/D0D0D0/222222?text=Mat+View+2'
    ],
    specifications: { "Material": "TPE", "Thickness": "6mm", "Feature": "Non-Slip" }
  },
  {
    id: 'p18', name: 'Waterproof Hiking Backpack', price: 6500,
    imageUrl: 'https://placehold.co/400x500/FFD700/222222?text=Hiking+Pack', category: 'Sports & Outdoors',
    description: 'Durable waterproof hiking backpack, perfect for outdoor adventures. Ample storage and comfortable design.',
    brand: 'TrailBlazer', stock: 15, rating: 4.8, numReviews: 90,
    images: [
      'https://placehold.co/400x500/FFD700/222222?text=Hiking+Pack',
      'https://placehold.co/400x500/FFA500/222222?text=Pack+View+2'
    ],
    specifications: { "Capacity": "40L", "Material": "Nylon", "Feature": "Waterproof" }
  },
  {
    id: 'p36', name: 'Adjustable Dumbbell Set (20kg)', price: 12000,
    imageUrl: 'https://placehold.co/400x500/800080/FFFFFF?text=Dumbbell+Set', category: 'Sports & Outdoors',
    description: 'Versatile adjustable dumbbell set, ideal for home workouts. Save space with this compact design.',
    brand: 'IronFlex', stock: 10, rating: 4.9, numReviews: 140,
    images: [
      'https://placehold.co/400x500/800080/FFFFFF?text=Dumbbell+Set',
      'https://placehold.co/400x500/6A006A/FFFFFF?text=Dumbbell+View+2'
    ],
    specifications: { "Weight Range": "2-20kg", "Material": "Cast Iron", "Feature": "Adjustable" }
  },

  // Home Textiles (Category: Home Textiles) - 3+ items
  {
    id: 'p19', name: 'Luxury Cotton Bedding Set', price: 7200,
    imageUrl: 'https://placehold.co/400x500/D81E05/FFFFFF?text=Bedding+Set', category: 'Home Textiles',
    description: 'Soft and luxurious cotton bedding set for a comfortable night\'s sleep. Includes duvet cover, sheets, and pillowcases.',
    brand: 'DreamWeave', stock: 18, rating: 4.7, numReviews: 160,
    images: [
      'https://placehold.co/400x500/D81E05/FFFFFF?text=Bedding+Set',
      'https://placehold.co/400x500/A01A04/FFFFFF?text=Bedding+View+2'
    ],
    specifications: { "Material": "100% Cotton", "Thread Count": "400", "Size": "Queen" }
  },
  {
    id: 'p37', name: 'Plush Throw Blanket', price: 2500,
    imageUrl: 'https://placehold.co/400x500/ADD8E6/222222?text=Throw+Blanket', category: 'Home Textiles',
    description: 'Ultra-soft plush throw blanket, perfect for cozying up on the couch. Adds a touch of warmth to any room.',
    brand: 'CozyHome', stock: 40, rating: 4.5, numReviews: 90,
    images: [
      'https://placehold.co/400x500/ADD8E6/222222?text=Throw+Blanket',
      'https://placehold.co/400x500/87CEEB/222222?text=Blanket+View+2'
    ],
    specifications: { "Material": "Fleece", "Dimensions": "150x200cm", "Feature": "Machine Washable" }
  },
  {
    id: 'p38', name: 'Decorative Throw Pillow', price: 900,
    imageUrl: 'https://placehold.co/400x500/90EE90/222222?text=Throw+Pillow', category: 'Home Textiles',
    description: 'Stylish decorative throw pillow to enhance your living space. Soft and comfortable for added support.',
    brand: 'AccentDecor', stock: 50, rating: 4.4, numReviews: 70,
    images: [
      'https://placehold.co/400x500/90EE90/222222?text=Throw+Pillow',
      'https://placehold.co/400x500/66CDAA/222222?text=Pillow+View+2'
    ],
    specifications: { "Material": "Cotton/Polyester", "Dimensions": "45x45cm", "Filling": "Polyester" }
  },

  // Toys & Games (Category: Toys & Games) - 3+ items
  {
    id: 'p20', name: 'Educational Building Blocks', price: 1400,
    imageUrl: 'https://placehold.co/400x500/222222/FFFFFF?text=Building+Blocks', category: 'Toys & Games',
    description: 'Colorful educational building blocks for creative play. Helps develop fine motor skills and problem-solving abilities.',
    brand: 'EduPlay', stock: 55, rating: 4.9, numReviews: 200,
    images: [
      'https://placehold.co/400x500/222222/FFFFFF?text=Building+Blocks',
      'https://placehold.co/400x500/444444/FFFFFF?text=Blocks+View+2'
    ],
    specifications: { "Material": "Non-toxic Plastic", "Pieces": "100", "Age Group": "3+ Years" }
  },
  {
    id: 'p39', name: 'Remote Control Drone', price: 8500,
    imageUrl: 'https://placehold.co/400x500/4169E1/FFFFFF?text=RC+Drone', category: 'Toys & Games',
    description: 'Easy-to-fly remote control drone with HD camera. Perfect for beginners and aerial photography enthusiasts.',
    brand: 'SkyHigh', stock: 10, rating: 4.6, numReviews: 80,
    images: [
      'https://placehold.co/400x500/4169E1/FFFFFF?text=RC+Drone',
      'https://placehold.co/400x500/1E90FF/FFFFFF?text=Drone+View+2'
    ],
    specifications: { "Flight Time": "15 min", "Camera": "720p HD", "Control Range": "100m" }
  },
  {
    id: 'p40', name: 'Board Game: Strategy Master', price: 2800,
    imageUrl: 'https://placehold.co/400x500/8B0000/FFFFFF?text=Board+Game', category: 'Toys & Games',
    description: 'Engaging strategy board game for family and friends. Develop critical thinking and tactical skills.',
    brand: 'GameOn', stock: 25, rating: 4.7, numReviews: 120,
    images: [
      'https://placehold.co/400x500/8B0000/FFFFFF?text=Board+Game',
      'https://placehold.co/400x500/A52A2A/FFFFFF?text=Game+View+2'
    ],
    specifications: { "Players": "2-4", "Playing Time": "60-90 min", "Age Group": "10+ Years" }
  },

  // Beauty & Health (Category: Beauty & Health) - 3+ items
  {
    id: 'p21', name: 'Organic Face Serum', price: 2700,
    imageUrl: 'https://placehold.co/400x500/F8F8F8/222222?text=Face+Serum', category: 'Beauty & Health',
    description: 'Nourishing organic face serum for radiant skin. Enriched with natural ingredients for a healthy glow.',
    brand: 'PureGlow', stock: 30, rating: 4.8, numReviews: 150,
    images: [
      'https://placehold.co/400x500/F8F8F8/222222?text=Face+Serum',
      'https://placehold.co/400x500/D0D0D0/222222?text=Serum+View+2'
    ],
    specifications: { "Volume": "30ml", "Skin Type": "All", "Feature": "Organic" }
  },
  {
    id: 'p41', name: 'Electric Toothbrush', price: 4500,
    imageUrl: 'https://placehold.co/400x500/4682B4/FFFFFF?text=Electric+Toothbrush', category: 'Beauty & Health',
    description: 'Advanced electric toothbrush for superior cleaning. Features multiple brushing modes and a long-lasting battery.',
    brand: 'OralCare', stock: 0, rating: 4.7, numReviews: 100,
    images: [
      'https://placehold.co/400x500/4682B4/FFFFFF?text=Electric+Toothbrush',
      'https://placehold.co/400x500/5F9EA0/FFFFFF?text=Toothbrush+View+2'
    ],
    specifications: { "Modes": "5", "Battery Life": "2 weeks", "Feature": "Pressure Sensor" }
  },
  {
    id: 'p42', name: 'Aromatherapy Essential Oil Diffuser', price: 3200,oldPrice: 3500,
    imageUrl: 'https://placehold.co/400x500/DAA520/FFFFFF?text=Oil+Diffuser', category: 'Beauty & Health',isNew: true,
    description: 'Stylish aromatherapy essential oil diffuser to create a relaxing ambiance. Features LED lighting and auto shut-off.',
    brand: 'ZenAroma', stock: 25, rating: 4.6, numReviews: 90,
    images: [
      'https://placehold.co/400x500/DAA520/FFFFFF?text=Oil+Diffuser',
      'https://placehold.co/400x500/B8860B/FFFFFF?text=Diffuser+View+2'
    ],
    specifications: { "Capacity": "300ml", "Run Time": "6 hours", "Feature": "LED Light" }
  },

  // Baby & Maternity (Category: Baby & Maternity) - 3+ items
  {
    id: 'p22', name: 'Baby Swaddle Blanket', price: 1100,
    imageUrl: 'https://placehold.co/400x500/FFD700/222222?text=Swaddle', category: 'Baby & Maternity',
    description: 'Soft and breathable baby swaddle blanket for a secure and comfortable sleep. Helps reduce startling reflex.',
    brand: 'LittleDream', stock: 40, rating: 4.8, numReviews: 180,
    images: [
      'https://placehold.co/400x500/FFD700/222222?text=Swaddle',
      'https://placehold.co/400x500/FFA500/222222?text=Swaddle+View+2'
    ],
    specifications: { "Material": "Organic Cotton", "Size": "Adjustable", "Feature": "Breathable" }
  },
  {
    id: 'p43', name: 'Diaper Bag Backpack', price: 4800,
    imageUrl: 'https://placehold.co/400x500/A9A9A9/FFFFFF?text=Diaper+Bag', category: 'Baby & Maternity',
    description: 'Spacious and functional diaper bag backpack with multiple compartments. Perfect for organizing baby essentials.',
    brand: 'MommyGo', stock: 20, rating: 4.7, numReviews: 100,
    images: [
      'https://placehold.co/400x500/A9A9A9/FFFFFF?text=Diaper+Bag',
      'https://placehold.co/400x500/778899/FFFFFF?text=Diaper+Bag+View+2'
    ],
    specifications: { "Material": "Waterproof Nylon", "Capacity": "25L", "Feature": "Insulated Pockets" }
  },
  {
    id: 'p44', name: 'Baby Monitor with Camera', price: 9500,
    imageUrl: 'https://placehold.co/400x500/6A5ACD/FFFFFF?text=Baby+Monitor', category: 'Baby & Maternity',
    description: 'High-definition baby monitor with night vision and two-way talk. Keep an eye on your little one from anywhere.',
    brand: 'SafeView', stock: 15, rating: 4.9, numReviews: 130,
    images: [
      'https://placehold.co/400x500/6A5ACD/FFFFFF?text=Baby+Monitor',
      'https://placehold.co/400x500/483D8B/FFFFFF?text=Monitor+View+2'
    ],
    specifications: { "Screen Size": "5 inch", "Feature": "Night Vision", "Range": "300m" }
  },

  // Bags & Luggage (Category: Bags & Luggage) - 3+ items
  {
    id: 'p14', name: 'Leather Wallet', price: 2500,
    imageUrl: 'https://placehold.co/400x500/FFD700/222222?text=Leather+Wallet', category: 'Bags & Luggage',
    description: 'Genuine leather wallet with multiple card slots and a coin pocket. Durable and stylish for everyday use.',
    brand: 'LeatherCraft', stock: 30, rating: 4.6, numReviews: 110,
    images: [
      'https://placehold.co/400x500/FFD700/222222?text=Leather+Wallet',
      'https://placehold.co/400x500/FFA500/222222?text=Wallet+View+2'
    ],
    specifications: { "Material": "Genuine Leather", "Slots": "8 Card Slots", "Feature": "RFID Blocking" }
  },
  {
    id: 'p45', name: 'Travel Carry-On Suitcase', price: 7500,
    imageUrl: 'https://placehold.co/400x500/708090/FFFFFF?text=Carry-On+Suitcase', category: 'Bags & Luggage',
    description: 'Lightweight and durable carry-on suitcase with spinner wheels. Perfect for short trips and weekend getaways.',
    brand: 'VoyageGear', stock: 20, rating: 4.7, numReviews: 95,
    images: [
      'https://placehold.co/400x500/708090/FFFFFF?text=Carry-On+Suitcase',
      'https://placehold.co/400x500/808080/FFFFFF?text=Suitcase+View+2'
    ],
    specifications: { "Material": "Polycarbonate", "Wheels": "Spinner", "Capacity": "40L" }
  },
  {
    id: 'p46', name: 'Stylish Crossbody Bag', price: 3800,
    imageUrl: 'https://placehold.co/400x500/DDA0DD/222222?text=Crossbody+Bag', category: 'Bags & Luggage',
    description: 'Fashionable crossbody bag with adjustable strap. Ideal for carrying essentials while on the go.',
    brand: 'ChicCarry', stock: 25, rating: 4.5, numReviews: 70,
    images: [
      'https://placehold.co/400x500/DDA0DD/222222?text=Crossbody+Bag',
      'https://placehold.co/400x500/EE82EE/222222?text=Bag+View+2'
    ],
    specifications: { "Material": "PU Leather", "Closure": "Zipper", "Strap": "Adjustable" }
  },

  // Appliances (Category: Appliances) - 3+ items
  {
    id: 'p25', name: 'Compact Air Fryer', price: 6700, oldPrice: 8000,
    imageUrl: 'https://placehold.co/400x500/F8F8F8/222222?text=Air+Fryer', category: 'Appliances', isPromotional: true,
    description: 'Healthy and efficient compact air fryer. Enjoy crispy meals with less oil. Easy to use and clean.',
    brand: 'CrispyCook', stock: 15, rating: 4.8, numReviews: 200,
    images: [
      'https://placehold.co/400x500/F8F8F8/222222?text=Air+Fryer',
      'https://placehold.co/400x500/D0D0D0/222222?text=Air+Fryer+View+2'
    ],
    specifications: { "Capacity": "3.5L", "Power": "1500W", "Feature": "Digital Display" }
  },
  {
    id: 'p47', name: 'Robot Vacuum Cleaner', price: 18000,
    imageUrl: 'https://placehold.co/400x500/2F4F4F/FFFFFF?text=Robot+Vacuum', category: 'Appliances',
    description: 'Smart robot vacuum cleaner with powerful suction and intelligent navigation. Clean your home effortlessly.',
    brand: 'CleanBot', stock: 8, rating: 4.9, numReviews: 120,
    images: [
      'https://placehold.co/400x500/2F4F4F/FFFFFF?text=Robot+Vacuum',
      'https://placehold.co/400x500/708090/FFFFFF?text=Vacuum+View+2'
    ],
    specifications: { "Battery Life": "120 min", "Feature": "Smart Mapping", "Control": "App/Voice" }
  },
  {
    id: 'p48', name: 'Handheld Garment Steamer', price: 3200,
    imageUrl: 'https://placehold.co/400x500/B0C4DE/222222?text=Garment+Steamer', category: 'Appliances',
    description: 'Compact and powerful handheld garment steamer for quick wrinkle removal. Ideal for travel and daily use.',
    brand: 'SmoothSteam', stock: 25, rating: 4.5, numReviews: 70,
    images: [
      'https://placehold.co/400x500/B0C4DE/222222?text=Garment+Steamer',
      'https://placehold.co/400x500/87CEFA/222222?text=Steamer+View+2'
    ],
    specifications: { "Water Tank": "200ml", "Heat Up Time": "30s", "Feature": "Portable" }
  },

  // Other categories with at least one item
  {
    id: 'p6', name: 'Summer Floral Blouse', price: 1500, oldPrice: 2000,
    imageUrl: 'https://placehold.co/400x500/F8F8F8/222222?text=Floral+Blouse', category: 'Sale', isPromotional: true,
    description: 'Lightweight summer floral blouse with a comfortable fit. Perfect for casual outings.',
    brand: 'BloomWear', stock: 10, rating: 4.2, numReviews: 50,
    images: [
      'https://placehold.co/400x500/F8F8F8/222222?text=Floral+Blouse',
      'https://placehold.co/400x500/D0D0D0/222222?text=Blouse+View+2'
    ],
    specifications: { "Material": "Viscose", "Sleeve Style": "Short Sleeve", "Pattern": "Floral" }
  },
  {
    id: 'p13', name: 'Minimalist Silver Necklace', price: 1600,
    imageUrl: 'https://placehold.co/400x500/F8F8F8/222222?text=Silver+Necklace', category: 'Jewelry & Accessories', isTrending: true,
    description: 'Elegant minimalist silver necklace, perfect for everyday wear or layering. Hypoallergenic material.',
    brand: 'ShineBright', stock: 30, rating: 4.7, numReviews: 100,
    images: [
      'https://placehold.co/400x500/F8F8F8/222222?text=Silver+Necklace',
      'https://placehold.co/400x500/D0D0D0/222222?text=Necklace+View+2'
    ],
    specifications: { "Material": "Sterling Silver", "Length": "45cm", "Feature": "Hypoallergenic" }
  },
  {
    id: 'p23', name: 'Ergonomic Office Chair', price: 12000,
    imageUrl: 'https://placehold.co/400x500/D81E05/FFFFFF?text=Office+Chair', category: 'Office & School Supplies',
    description: 'High-back ergonomic office chair with adjustable lumbar support. Designed for long hours of comfortable work.',
    brand: 'WorkSmart', stock: 7, rating: 4.9, numReviews: 80,
    images: [
      'https://placehold.co/400x500/D81E05/FFFFFF?text=Office+Chair',
      'https://placehold.co/400x500/A01A04/FFFFFF?text=Chair+View+2'
    ],
    specifications: { "Material": "Mesh/Nylon", "Adjustments": "Height, Lumbar", "Weight Capacity": "120kg" }
  },
  {
    id: 'p24', name: 'Automatic Pet Feeder', price: 4800,
    imageUrl: 'https://placehold.co/400x500/222222/FFFFFF?text=Pet+Feeder', category: 'Pet Supplies',
    description: 'Programmable automatic pet feeder with portion control. Ensures your pet is fed on time, every time.',
    brand: 'PetPal', stock: 18, rating: 4.6, numReviews: 60,
    images: [
      'https://placehold.co/400x500/222222/FFFFFF?text=Pet+Feeder',
      'https://placehold.co/400x500/444444/FFFFFF?text=Feeder+View+2'
    ],
    specifications: { "Capacity": "3.5L", "Feeding Schedule": "Programmable", "Feature": "Voice Recorder" }
  },
  {
    id: 'p26', name: 'Car Dash Camera', price: 5500,
    imageUrl: 'https://placehold.co/400x500/FFD700/222222?text=Dash+Cam', category: 'Automotive',
    description: 'Full HD car dash camera with wide-angle lens and loop recording. Essential for road safety and incident recording.',
    brand: 'RoadGuard', stock: 12, rating: 4.5, numReviews: 75,
    images: [
      'https://placehold.co/400x500/FFD700/222222?text=Dash+Cam',
      'https://placehold.co/400x500/FFA500/222222?text=Dash+Cam+View+2'
    ],
    specifications: { "Resolution": "1080p", "Lens Angle": "170°", "Feature": "Loop Recording" }
  },
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

// Mock function to get all unique categories
export const getAllCategories = (): string[] => {
  // Corrected to use DUMMY_PRODUCTS instead of getAllProducts
  const categories = [...new Set(DUMMY_PRODUCTS.map(product => product.category))];
  return categories.sort(); // Sort alphabetically
};
