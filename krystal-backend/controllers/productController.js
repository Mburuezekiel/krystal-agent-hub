import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import Notification from '../models/Notification.js'; // Assuming you have a Notification model

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Agent
const createProduct = asyncHandler(async (req, res) => {
  const {
    name, price, imageUrl, category, oldPrice, isNew, isTrending,
    isPromotional, description, brand, stock, images, specifications,
    sku, tags, isActive
  } = req.body;

  // req.user is populated by the protect middleware
  const agentId = req.user._id;

  // Basic validation for required fields
  if (!name || !price || !category || !description || !brand) {
    res.status(400);
    throw new Error('Please fill all required product fields: name, price, category, description, brand.');
  }

  // Set a default image URL if not provided
  const defaultImageUrl = 'https://placehold.co/400x500/D81E05/FFFFFF?text=Product';
  const finalImageUrl = imageUrl || defaultImageUrl;

  const product = new Product({
    name,
    price,
    imageUrl: finalImageUrl,
    category,
    oldPrice,
    isNew: isNew !== undefined ? isNew : false, // Default to false if not provided
    isTrending: isTrending !== undefined ? isTrending : false, // Default to false
    isPromotional: isPromotional !== undefined ? isPromotional : false, // Default to false
    description,
    brand,
    stock: stock !== undefined ? stock : 0, // Default to 0 if not provided
    images: images && images.length > 0 ? images : [finalImageUrl], // Use provided images or default
    specifications: specifications || {}, // Default to empty object
    sku, // SKU might be optional or generated in a real app
    tags: tags || [], // Default to empty array
    isActive: isActive !== undefined ? isActive : true, // Default to true
    agent: agentId,
    reviewStatus: 'pending', // New products are pending review by default
    rejectionReason: null, // No rejection reason initially
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Get all products (with filters and role-based access)
// @route   GET /api/products
// @route   GET /api/products/admin (for admin-specific access)
// @access  Public (for approved/active products), Private/Admin, Private/Agent
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = parseInt(req.query.pageSize) || 10;
  const page = parseInt(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i', 
        },
      }
    : {};

  const category = req.query.category ? { category: req.query.category } : {};
  const brand = req.query.brand ? { brand: req.query.brand } : {};

  // Base query: starts with keyword, category, brand filters
  let findQuery = {
    ...keyword,
    ...category,
    ...brand,
  };

  // Default filters for public/unauthenticated users
  // These will be overridden for admin/agent roles below
  findQuery.reviewStatus = 'approved';
  findQuery.isActive = true;

  // Apply boolean filters if present in query
  if (req.query.isNew === 'true') {
    findQuery.isNew = true;
  }
  if (req.query.isTrending === 'true') {
    findQuery.isTrending = true;
  }
  if (req.query.isPromotional === 'true') {
    findQuery.isPromotional = true;
  }

  // --- Personalized Recommendations Logic (from your original code) ---
  // This block should ideally be in its own dedicated controller function
  // and route, but is kept here for consistency with your provided structure.
  if (req.query.personalized === 'true' || req.query.userId) {
    // For personalized recommendations, always ensure products are approved and active
    findQuery.reviewStatus = 'approved';
    findQuery.isActive = true;

    const totalApprovedActiveProducts = await Product.countDocuments(findQuery);
    if (totalApprovedActiveProducts === 0) {
      return res.json({ products: [], page: 1, pages: 1, totalCount: 0 });
    }

    // Implement random skip for personalized recommendations
    const maxSkip = Math.max(0, totalApprovedActiveProducts - pageSize);
    const randomSkip = Math.floor(Math.random() * (maxSkip + 1));

    const products = await Product.find(findQuery)
      .populate('agent', 'firstName lastName email userName')
      .skip(randomSkip)
      .limit(pageSize);

    // For personalized, we return a single "page" of random products
    return res.json({ products, page: 1, pages: 1, totalCount: products.length });
  }

  // --- Role-based Access and Filtering ---
  // This is where admin and agent specific filtering logic applies
  if (req.user) {
    if (req.user.role === 'admin') {
      // Admin can see ALL products by default, so remove public filters
      delete findQuery.reviewStatus;
      delete findQuery.isActive;

      // Allow admin to filter by specific reviewStatus (e.g., 'pending', 'rejected', 'approved', 'all')
      if (req.query.reviewStatus && req.query.reviewStatus !== 'all') {
        findQuery.reviewStatus = req.query.reviewStatus;
      }
      // Allow admin to filter by isActive status (true, false, 'all')
      if (req.query.isActive !== undefined && req.query.isActive !== 'all') {
        findQuery.isActive = req.query.isActive === 'true';
      } else if (req.query.isActive === 'all') {
        // If 'all' is explicitly requested, don't filter by isActive
        delete findQuery.isActive;
      }

    } else if (req.user.role === 'agent') {
      // Agents can only see their own products
      findQuery.agent = req.user._id;
      // Agents can filter their own products by reviewStatus and isActive
      delete findQuery.reviewStatus; // Remove default 'approved' for agents
      delete findQuery.isActive;     // Remove default 'active' for agents

      if (req.query.reviewStatus && req.query.reviewStatus !== 'all') {
        findQuery.reviewStatus = req.query.reviewStatus;
      }
      if (req.query.isActive !== undefined && req.query.isActive !== 'all') {
        findQuery.isActive = req.query.isActive === 'true';
      } else if (req.query.isActive === 'all') {
        // If 'all' is explicitly requested, don't filter by isActive
        delete findQuery.isActive;
      }
    }
    // For non-admin/non-agent authenticated users, the default public filters apply.
  }
  // If req.user is not present (public access), the initial findQuery defaults remain:
  // reviewStatus: 'approved', isActive: true

  // Count total documents matching the query for pagination
  const count = await Product.countDocuments(findQuery);

  // Fetch products with pagination and sorting
  const products = await Product.find(findQuery)
    .populate('agent', 'firstName lastName email userName') // Populate agent details
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 }); // Sort by creation date, newest first

  res.json({ products, page, pages: Math.ceil(count / pageSize), totalCount: count });
});

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public (if approved/active), Private/Admin, Private/Agent (if owner)
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('agent', 'firstName lastName email userName');

  if (product) {
    // Check if user is authenticated and is admin or agent
    if (req.user && (req.user.role === 'admin' || req.user.role === 'agent')) {
      // If agent, ensure they own the product or it's publicly viewable
      if (req.user.role === 'agent' && product.agent.toString() !== req.user._id.toString()) {
        // Agent can only view other agents' products if approved and active
        if (product.reviewStatus !== 'approved' || !product.isActive) {
          res.status(404);
          throw new Error('Product not found or not available for public viewing');
        }
      }
      // Admin can view any product regardless of status
      // Agent owner can view their own product regardless of status
      res.json(product);
    } else {
      // Public access: only approved and active products
      if (product.reviewStatus === 'approved' && product.isActive) {
        res.json(product);
      } else {
        res.status(404);
        throw new Error('Product not found or not available for public viewing');
      }
    }
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Agent (owner), Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name, price, imageUrl, category, oldPrice, isNew, isTrending,
    isPromotional, description, brand, stock, rating, numReviews, images,
    specifications, sku, tags, isActive
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const isAdmin = req.user.role === 'admin';
    const isOwner = product.agent.toString() === req.user._id.toString();

    // Only admin or product owner can update
    if (!isAdmin && !isOwner) {
      res.status(403);
      throw new Error('Not authorized to update this product');
    }

    // Update fields if provided in the request body
    product.name = name !== undefined ? name : product.name;
    product.price = price !== undefined ? price : product.price;
    product.imageUrl = imageUrl !== undefined ? imageUrl : product.imageUrl;
    product.category = category !== undefined ? category : product.category;
    product.oldPrice = oldPrice !== undefined ? oldPrice : product.oldPrice;
    product.isNew = isNew !== undefined ? isNew : product.isNew;
    product.isTrending = isTrending !== undefined ? isTrending : product.isTrending;
    product.isPromotional = isPromotional !== undefined ? isPromotional : product.isPromotional;
    product.description = description !== undefined ? description : product.description;
    product.brand = brand !== undefined ? brand : product.brand;
    product.stock = stock !== undefined ? stock : product.stock;
    product.rating = rating !== undefined ? rating : product.rating;
    product.numReviews = numReviews !== undefined ? numReviews : product.numReviews;
    product.images = images && images.length > 0 ? images : product.images; 
    product.specifications = specifications !== undefined ? specifications : product.specifications;
    product.sku = sku !== undefined ? sku : product.sku;
    product.tags = tags !== undefined ? tags : product.tags;
    product.isActive = isActive !== undefined ? isActive : product.isActive;

    // If an agent updates an already approved product, set status back to pending for re-review
    // Admins can update without changing reviewStatus unless they explicitly set it
    if (isOwner && !isAdmin && product.reviewStatus === 'approved') {
        product.reviewStatus = 'pending';
        product.rejectionReason = null; // Clear rejection reason on agent update
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Soft delete a product (mark as inactive)
// @route   DELETE /api/products/:id
// @access  Private/Agent (owner), Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    const isAdmin = req.user.role === 'admin';
    const isOwner = product.agent.toString() === req.user._id.toString();

    // Only admin or product owner can delete (soft delete)
    if (!isAdmin && !isOwner) {
      res.status(403);
      throw new Error('Not authorized to delete this product');
    }

    product.isActive = false; // Mark product as inactive
    await product.save();
    res.json({ message: 'Product marked as inactive (soft deleted)' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});



// @desc    Upload a product image URL
// @route   POST /api/products/:id/upload-image
// @access  Private/Agent (owner), Private/Admin
const uploadProductImage = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    const isAdmin = req.user.role === 'admin';
    const isOwner = product.agent.toString() === req.user._id.toString();

    // Only admin or product owner can upload images for this product
    if (!isAdmin && !isOwner) {
      res.status(403);
      throw new Error('Not authorized to upload images for this product');
    }

    // For simplicity, we're just taking a URL from the body.
    // In a real app, this would involve file uploads to cloud storage (e.g., Cloudinary, S3).
    const newImageUrl = req.body.imageUrl || `https://placehold.co/400x500/0000FF/FFFFFF?text=Image-${Date.now()}`;

    // Add image to the images array if it's not already there
    if (!product.images.includes(newImageUrl)) {
        product.images.push(newImageUrl);
    }
    // Optionally update the main imageUrl to the newly uploaded one
    product.imageUrl = newImageUrl;

    await product.save();
    res.json({ message: 'Image URL added (placeholder)', imageUrl: newImageUrl, images: product.images });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get personalized product recommendations
// @route   GET /api/products/recommendations
// @access  Public
const getPersonalizedRecommendations = asyncHandler(async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8; // Default to 8 recommendations
    console.log(`Backend: Attempting to fetch ${limit} active and approved products for recommendations.`);

    // Find products that are active and approved
    const products = await Product.find({
      isActive: true,
      reviewStatus: 'approved'
    })
    .limit(limit)
    .lean(); // .lean() for faster query if you don't need Mongoose document methods

    console.log(`Backend: Found ${products ? products.length : 0} active and approved products for recommendations.`);

    if (!products || products.length === 0) {
      console.log('Backend: No active and approved products found for recommendations.');
      return res.status(200).json({ products: [], page: 1, pages: 1, totalCount: 0 });
    }

    // Simple shuffling for "personalization" (random selection)
    const shuffledProducts = products.sort(() => 0.5 - Math.random());

    res.status(200).json({
      products: shuffledProducts,
      page: 1, // Always 1 for recommendations as it's a single set
      pages: 1, // Always 1 for recommendations
      totalCount: shuffledProducts.length
    });
    console.log('Backend: Successfully sent recommendations response.');

  } catch (error) {
    console.error('Backend Error in getPersonalizedRecommendations:', error.message, error.stack);
    res.status(500).json({
      message: 'Server error fetching personalized recommendations',
      error: error.message,
      detailedError: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});



// @desc    Get all products for admin review (with search and filter)
// @route   GET /api/products/admin
// @access  Private/Admin
const getProductsForAdmin = asyncHandler(async (req, res) => {
  const pageSize = 10; // Number of products per page
  const page = Number(req.query.pageNumber) || 1; // Current page number

  const keyword = req.query.keyword
    ? {
        $or: [
          { name: { $regex: req.query.keyword, $options: 'i' } },
          { brand: { $regex: req.query.keyword, $options: 'i' } },
        ],
      }
    : {};

  const statusFilter = req.query.reviewStatus;
  const filter = { ...keyword };

  if (statusFilter && statusFilter !== 'all') {
    filter.reviewStatus = statusFilter;
  }

  const count = await Product.countDocuments({ ...filter });
  const products = await Product.find({ ...filter })
    .populate('agent', 'firstName lastName userName email') // Populate agent details
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize), totalCount: count });
});

// @desc    Review a product (approve/reject)
// @route   PUT /api/products/:id/review
// @access  Private/Admin
const reviewProduct = asyncHandler(async (req, res) => {
  const { status, reason } = req.body; // status: "approved" or "rejected", reason (optional for approved)
  const { id } = req.params;

  const product = await Product.findById(id);

  if (product) {
    if (status === 'approved') {
      product.reviewStatus = 'approved';
      product.rejectionReason = undefined; // Clear rejection reason if approved
    } else if (status === 'rejected') {
      if (!reason) {
        res.status(400);
        throw new Error('Rejection reason is required for rejected status.');
      }
      product.reviewStatus = 'rejected';
      product.rejectionReason = reason;
    } else {
      res.status(400);
      throw new Error('Invalid review status. Must be "approved" or "rejected".');
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});
const getAgentProducts = asyncHandler(async (req, res) => {
  const pageSize = 10; // You can make this configurable
  const page = Number(req.query.pageNumber) || 1;
  const agentId = req.user._id; // Get the ID of the authenticated agent

  const keyword = req.query.keyword
    ? {
        $or: [
          { name: { $regex: req.query.keyword, $options: 'i' } },
          { brand: { $regex: req.query.keyword, $options: 'i' } },
        ],
      }
    : {};

  const statusFilter = req.query.reviewStatus;
  const filter = { ...keyword, agent: agentId }; // IMPORTANT: Filter by agent ID

  if (statusFilter && statusFilter !== 'all') {
    filter.reviewStatus = statusFilter;
  }

  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate('agent', 'firstName lastName userName email') // Still populate agent if you need their details
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize), totalCount: count });
});


export {
  getPersonalizedRecommendations,
  createProduct,
  getAgentProducts,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  reviewProduct,
  getProductsForAdmin,
  uploadProductImage,
};