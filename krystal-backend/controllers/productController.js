// backend/controllers/productController.js
import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import User from '../models/User.js'; // Assuming you need User model for agent details

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Agent & Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name, price, imageUrl, category, oldPrice, isNew, isTrending,
    isPromotional, description, brand, stock, images, specifications,
    sku, tags, isActive
  } = req.body;

  // Agent ID comes from authenticated user (req.user._id)
  const agentId = req.user._id;

  // Basic validation
  if (!name || !price || !category || !description || !brand) {
    res.status(400);
    throw new Error('Please fill all required product fields: name, price, category, description, brand.');
  }

  // Set default imageUrl if not provided or empty
  const defaultImageUrl = 'https://placehold.co/400x500/D81E05/FFFFFF?text=Product';
  const finalImageUrl = imageUrl || defaultImageUrl;

  const product = new Product({
    name,
    price,
    imageUrl: finalImageUrl,
    category,
    oldPrice,
    isNew,
    isTrending,
    isPromotional,
    description,
    brand,
    stock: stock || 0, // Default to 0 if not provided
    images: images && images.length > 0 ? images : [finalImageUrl], // If images array is empty or not provided, default to main imageUrl
    specifications: specifications || {},
    sku,
    tags,
    isActive,
    agent: agentId, // Assign the current user (agent/admin) as the product's agent
    reviewStatus: 'pending', // New products are always pending review
    rejectionReason: null,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Get all products (with optional filtering/pagination)
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
const pageSize = parseInt(req.query.pageSize) || 10;
  const page = parseInt(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i', // Case-insensitive
        },
      }
    : {};

  const category = req.query.category ? { category: req.query.category } : {};
  const brand = req.query.brand ? { brand: req.query.brand } : {};
  const reviewStatus = req.query.reviewStatus ? { reviewStatus: req.query.reviewStatus } : { reviewStatus: 'approved' }; // Default to only approved products for public view unless specified

  // Allow admins to see all products, agents their own, public only approved
  let findQuery = { ...keyword, ...category, ...brand, ...reviewStatus, isActive: true };

  // If user is admin, they can see products of any status or inactive ones
  if (req.user && req.user.role === 'admin') {
      delete findQuery.reviewStatus; // Admin can query any status
      delete findQuery.isActive; // Admin can query inactive ones too
      if (req.query.reviewStatus) { // But if admin explicitly asks for a status, apply it
          findQuery.reviewStatus = req.query.reviewStatus;
      }
      if (req.query.isActive !== undefined) { // If admin explicitly asks for active status, apply it
          findQuery.isActive = req.query.isActive === 'true';
      }
  } else if (req.user && req.user.role === 'agent') {
      // Agent can see their own products regardless of review status
      findQuery.agent = req.user._id;
      delete findQuery.reviewStatus; // Agent can see their pending/rejected products
      if (req.query.reviewStatus) { // But if agent explicitly asks for a status, apply it
          findQuery.reviewStatus = req.query.reviewStatus;
      }
      // Agents can only see their active products by default unless they explicitly ask for inactive
      if (req.query.isActive !== undefined) {
          findQuery.isActive = req.query.isActive === 'true';
      } else {
          findQuery.isActive = true;
      }
  }


  const count = await Product.countDocuments(findQuery);
  const products = await Product.find(findQuery)
    .populate('agent', 'firstName lastName email userName') // Populate agent details (only certain fields)
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 }); // Sort by most recent

  res.json({ products, page, pages: Math.ceil(count / pageSize), totalCount: count });
});


// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('agent', 'firstName lastName email userName');

  if (product) {
    // If not admin/agent, only show if approved and active
    if (req.user && (req.user.role === 'admin' || req.user.role === 'agent')) {
      // Admin/agent can view any product regardless of status/active status
      // An agent can view their own products even if not active/approved
      if (req.user.role === 'agent' && product.agent.toString() !== req.user._id.toString()) {
        if (product.reviewStatus !== 'approved' || !product.isActive) {
          res.status(404);
          throw new Error('Product not found or not available for public viewing');
        }
      }
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
// @access  Private/Agent & Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name, price, imageUrl, category, oldPrice, isNew, isTrending,
    isPromotional, description, brand, stock, rating, numReviews, images,
    specifications, sku, tags, isActive
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    // Check if user is admin OR the agent who owns the product
    const isAdmin = req.user.role === 'admin';
    const isOwner = product.agent.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      res.status(403);
      throw new Error('Not authorized to update this product');
    }

    product.name = name || product.name;
    product.price = price !== undefined ? price : product.price;
    product.imageUrl = imageUrl || product.imageUrl;
    product.category = category || product.category;
    product.oldPrice = oldPrice !== undefined ? oldPrice : product.oldPrice;
    product.isNew = isNew !== undefined ? isNew : product.isNew;
    product.isTrending = isTrending !== undefined ? isTrending : product.isTrending;
    product.isPromotional = isPromotional !== undefined ? isPromotional : product.isPromotional;
    product.description = description || product.description;
    product.brand = brand || product.brand;
    product.stock = stock !== undefined ? stock : product.stock;
    product.rating = rating !== undefined ? rating : product.rating;
    product.numReviews = numReviews !== undefined ? numReviews : product.numReviews;
    product.images = images && images.length > 0 ? images : [product.imageUrl]; // Update images
    product.specifications = specifications !== undefined ? specifications : product.specifications;
    product.sku = sku || product.sku;
    product.tags = tags !== undefined ? tags : product.tags;
    product.isActive = isActive !== undefined ? isActive : product.isActive;

    // If a non-admin agent updates their product, its status should revert to pending for re-review
    if (isOwner && !isAdmin && product.reviewStatus === 'approved') {
        product.reviewStatus = 'pending';
        product.rejectionReason = null; // Clear any previous rejection reason
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product (soft delete by setting isActive to false)
// @route   DELETE /api/products/:id
// @access  Private/Agent & Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    // Check if user is admin OR the agent who owns the product
    const isAdmin = req.user.role === 'admin';
    const isOwner = product.agent.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      res.status(403);
      throw new Error('Not authorized to delete this product');
    }

    product.isActive = false; // Soft delete
    await product.save();
    res.json({ message: 'Product marked as inactive (soft deleted)' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Review a product (approve/reject)
// @route   PUT /api/products/:id/review
// @access  Private/Admin
const reviewProduct = asyncHandler(async (req, res) => {
  const { status, reason } = req.body; // status: 'approved' or 'rejected'
  const product = await Product.findById(req.params.id);

  if (product) {
    if (status === 'approved' || status === 'rejected') {
      product.reviewStatus = status;
      product.rejectionReason = status === 'rejected' ? reason : null;

      if (status === 'rejected' && !reason) {
        res.status(400);
        throw new Error('Rejection reason is required when status is rejected');
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(400);
      throw new Error('Invalid review status. Must be "approved" or "rejected".');
    }
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});


// @desc    Upload product image (Placeholder - Cloudinary/S3 will be implemented later)
// @route   POST /api/products/:id/upload-image
// @access  Private/Agent & Admin
const uploadProductImage = asyncHandler(async (req, res) => {
  // This is a placeholder for actual image upload logic.
  // In a real scenario, you'd integrate with Cloudflare Images, Cloudinary, S3, etc.
  // For now, it just simulates adding an image URL.

  const product = await Product.findById(req.params.id);

  if (product) {
    const isAdmin = req.user.role === 'admin';
    const isOwner = product.agent.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      res.status(403);
      throw new Error('Not authorized to upload images for this product');
    }

    // In a real scenario, req.body.imageUrl would come from the upload service response
    // For now, let's assume the frontend sends a URL directly for testing
    const newImageUrl = req.body.imageUrl || `https://placehold.co/400x500/0000FF/FFFFFF?text=Image-${Date.now()}`;

    // Add the new image URL to the images array, ensuring uniqueness
    if (!product.images.includes(newImageUrl)) {
        product.images.push(newImageUrl);
    }
    // You might also want to update the main imageUrl if this is the primary new image
     product.imageUrl = newImageUrl;

    await product.save();
    res.json({ message: 'Image URL added (placeholder)', imageUrl: newImageUrl, images: product.images });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});


export {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  reviewProduct,
  uploadProductImage, // Export the new image upload placeholder
};