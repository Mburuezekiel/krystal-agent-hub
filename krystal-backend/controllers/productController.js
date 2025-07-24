import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import User from '../models/User.js'; // Assuming User model is imported for agent details

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Agent & Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name, price, imageUrl, category, oldPrice, isNew, isTrending,
    isPromotional, description, brand, stock, images, specifications,
    sku, tags
  } = req.body;

  // req.user is populated by the protect middleware
  const agentId = req.user._id;

  // Basic validation for required fields
  if (!name || !price || !category || !description || !brand || stock === undefined || stock === null) {
    res.status(400);
    throw new Error('Please fill all required product fields: name, price, category, description, brand, and stock.');
  }

  // Ensure stock is a non-negative number
  const finalStock = Math.max(0, Number(stock));

  // Set a default image if none provided
  const defaultPlaceholderImageUrl = 'https://placehold.co/400x500/D81E05/FFFFFF?text=Product';
  const finalImageUrl = imageUrl || defaultPlaceholderImageUrl;

  // Ensure images array is properly handled
  const finalImages = Array.isArray(images) && images.length > 0
    ? images.filter(img => img && typeof img === 'string' && img.trim() !== '') // Filter out empty/invalid strings
    : [finalImageUrl]; // Fallback to main image if images array is empty or invalid

  const product = new Product({
    name,
    price: Number(price), // Ensure price is a number
    imageUrl: finalImageUrl,
    category,
    oldPrice: oldPrice !== undefined && oldPrice !== null ? Number(oldPrice) : null, // Handle optional oldPrice
    isNew: isNew === true, // Ensure boolean
    isTrending: isTrending === true, // Ensure boolean
    isPromotional: isPromotional === true, // Ensure boolean
    description,
    brand,
    stock: finalStock,
    images: finalImages,
    specifications: specifications || {}, // Default to empty object if not provided
    sku: sku || '', // Default to empty string
    tags: Array.isArray(tags) ? tags.filter(tag => tag.trim() !== '') : [], // Ensure array of non-empty tags
    isActive: true, // New products are active by default (subject to admin review)
    agent: agentId,
    reviewStatus: 'pending', // New products always start as pending review
    rejectionReason: null,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Fetch all products (with filters, search, pagination)
// @route   GET /api/products
// @access  Public (except certain views for admin/agent)
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = parseInt(req.query.pageSize) || 10;
  const page = parseInt(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: 'i' } }
    : {};

  const category = req.query.category ? { category: req.query.category } : {};
  const brand = req.query.brand ? { brand: req.query.brand } : {};

  let findQuery = {
    ...keyword,
    ...category,
    ...brand,
  };

  // Default filters for public view (if not admin/agent or personalized)
  let applyPublicFilters = true;

  if (req.user) {
    if (req.user.role === 'admin') {
      applyPublicFilters = false; // Admin bypasses default public filters
      // Admins can see products regardless of reviewStatus or isActive unless specifically filtered
      if (req.query.reviewStatus) {
        findQuery.reviewStatus = req.query.reviewStatus;
      }
      if (req.query.isActive !== undefined) {
        findQuery.isActive = req.query.isActive === 'true';
      }
    } else if (req.user.role === 'agent') {
      applyPublicFilters = false; // Agent bypasses default public filters for their own products
      findQuery.agent = req.user._id; // Agents only see their own products

      // Agents can see their own products regardless of reviewStatus unless specifically filtered
      if (req.query.reviewStatus) {
        findQuery.reviewStatus = req.query.reviewStatus;
      }
      // Agents can see their own products regardless of isActive status unless specifically filtered
      // This is the key change: if isActive is not explicitly queried, don't force it to true for agents
      if (req.query.isActive !== undefined) {
          findQuery.isActive = req.query.isActive === 'true';
      }
      // If no isActive filter is provided, don't add it to the query for agents here.
      // They should see both active and inactive of their own, unless a filter is sent.
    }
  }

  // Apply general filters (isNew, isTrending, isPromotional)
  if (req.query.isNew === 'true') {
    findQuery.isNew = true;
  }
  if (req.query.isTrending === 'true') {
    findQuery.isTrending = true;
  }
  if (req.query.isPromotional === 'true') {
    findQuery.isPromotional = true;
  }

  // Personalized/Randomized product fetching for general users
  if (req.query.personalized === 'true' || req.query.userId) {
    // For personalized views, always enforce approved and active
    findQuery.reviewStatus = 'approved';
    findQuery.isActive = true;

    const totalApprovedActiveProducts = await Product.countDocuments(findQuery);
    if (totalApprovedActiveProducts === 0) {
      return res.json({ products: [], page: 1, pages: 1, totalCount: 0 });
    }

    // Adjust page logic for true randomization across all approved/active products
    const randomSkip = Math.floor(Math.random() * Math.max(0, totalApprovedActiveProducts - pageSize + 1));

    const products = await Product.find(findQuery)
      .populate('agent', 'firstName lastName email userName')
      .skip(randomSkip)
      .limit(pageSize);

    // For personalized, we might not have 'pages' in the traditional sense.
    // Return current products and their count.
    return res.json({ products, page: 1, pages: 1, totalCount: products.length });
  }

  // Apply public filters if not handled by admin/agent roles or personalized logic
  if (applyPublicFilters) {
    findQuery.reviewStatus = 'approved';
    findQuery.isActive = true;
  }


  // Log the final query for debugging
  console.log('Final findQuery for MongoDB:', findQuery);

  const count = await Product.countDocuments(findQuery);
  const products = await Product.find(findQuery)
    .populate('agent', 'firstName lastName email userName')
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 }); // Sort by creation date, newest first

  res.json({ products, page, pages: Math.ceil(count / pageSize), totalCount: count });
});


// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public (restricted for non-approved/inactive unless admin/agent owner)
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('agent', 'firstName lastName email userName');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if authenticated user is admin or the product's agent
  const isAuthorizedUser = req.user && (req.user.role === 'admin' || product.agent.toString() === req.user._id.toString());

  if (isAuthorizedUser) {
    // Admin or product owner agent can view the product regardless of status
    res.json(product);
  } else {
    // Public view: Product must be approved and active
    if (product.reviewStatus === 'approved' && product.isActive) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error('Product not found or not available for public viewing');
    }
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Agent (owner) & Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name, price, imageUrl, category, oldPrice, isNew, isTrending,
    isPromotional, description, brand, stock, images,
    specifications, sku, tags, isActive // isActive can only be directly changed by admin
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const isAdmin = req.user.role === 'admin';
  const isOwner = product.agent.toString() === req.user._id.toString();

  // Authorization check
  if (!isAdmin && !isOwner) {
    res.status(403);
    throw new Error('Not authorized to update this product');
  }

  // Update fields if provided in the request body
  product.name = name !== undefined ? name : product.name;
  product.price = price !== undefined ? Number(price) : product.price;
  product.imageUrl = imageUrl !== undefined ? imageUrl : product.imageUrl;
  product.category = category !== undefined ? category : product.category;
  product.oldPrice = oldPrice !== undefined ? (oldPrice !== null ? Number(oldPrice) : null) : product.oldPrice;
  product.isNew = isNew !== undefined ? isNew : product.isNew;
  product.isTrending = isTrending !== undefined ? isTrending : product.isTrending;
  product.isPromotional = isPromotional !== undefined ? isPromotional : product.isPromotional;
  product.description = description !== undefined ? description : product.description;
  product.brand = brand !== undefined ? brand : product.brand;
  product.stock = stock !== undefined ? Number(stock) : product.stock;

  // Handle images array update
  if (images !== undefined) {
      product.images = Array.isArray(images) && images.length > 0
          ? images.filter(img => img && typeof img === 'string' && img.trim() !== '')
          : (product.imageUrl ? [product.imageUrl] : []); // Fallback if images array is empty
  } else {
      // If images array is not provided in update, ensure main imageUrl is still in images array if it exists
      if (product.imageUrl && !product.images.includes(product.imageUrl)) {
          product.images.unshift(product.imageUrl); // Add to start if not present
      }
  }

  product.specifications = specifications !== undefined ? specifications : product.specifications;
  product.sku = sku !== undefined ? sku : product.sku;
  product.tags = tags !== undefined ? (Array.isArray(tags) ? tags.filter(tag => tag.trim() !== '') : []) : product.tags;

  // Only admin can directly change isActive status
  if (isAdmin && isActive !== undefined) {
    product.isActive = isActive;
  }

  // If an agent (not admin) updates their approved product, set it back to pending for re-review
  if (isOwner && !isAdmin && product.reviewStatus === 'approved') {
    product.reviewStatus = 'pending';
    product.rejectionReason = null;
  }

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

// @desc    Soft delete a product (set isActive to false)
// @route   DELETE /api/products/:id
// @access  Private/Agent (owner) & Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const isAdmin = req.user.role === 'admin';
  const isOwner = product.agent.toString() === req.user._id.toString();

  // Authorization check
  if (!isAdmin && !isOwner) {
    res.status(403);
    throw new Error('Not authorized to delete this product');
  }

  // Soft delete: set isActive to false
  product.isActive = false;
  await product.save();
  res.json({ message: 'Product marked as inactive (soft deleted)' });
});

// @desc    Review/Approve/Reject a product
// @route   PUT /api/products/:id/review
// @access  Private/Admin
const reviewProduct = asyncHandler(async (req, res) => {
  const { status, reason } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // This route should be protected by 'admin' middleware, but
  // an additional check here adds robustness.
  if (req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to review products.');
  }

  if (status === 'approved' || status === 'rejected') {
    product.reviewStatus = status;
    product.rejectionReason = status === 'rejected' ? (reason || null) : null;

    // If rejected, reason is mandatory
    if (status === 'rejected' && (!reason || reason.trim() === '')) {
      res.status(400);
      throw new Error('Rejection reason is required when status is rejected.');
    }

    // When a product is approved, ensure it's active.
    // When rejected, it typically becomes inactive unless admin chooses otherwise.
    // For simplicity, let's keep it active if approved, leave isActive as is if rejected
    // (admin can change isActive separately if needed).
    if (status === 'approved') {
        product.isActive = true;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(400);
    throw new Error('Invalid review status. Must be "approved" or "rejected".');
  }
});

// @desc    Upload (add) product image URL
// @route   POST /api/products/:id/upload-image
// @access  Private/Agent (owner) & Admin
const uploadProductImage = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const isAdmin = req.user.role === 'admin';
  const isOwner = product.agent.toString() === req.user._id.toString();

  if (!isAdmin && !isOwner) {
    res.status(403);
    throw new Error('Not authorized to upload images for this product');
  }

  const newImageUrl = req.body.imageUrl;

  if (!newImageUrl || typeof newImageUrl !== 'string' || newImageUrl.trim() === '') {
      res.status(400);
      throw new Error('Image URL is required.');
  }

  // Add the new image URL if it's not already in the array
  if (!product.images.includes(newImageUrl)) {
      product.images.push(newImageUrl);
  }

  // Option to set this new image as the main imageUrl if desired by frontend (e.g., first image becomes main)
  // For now, we only add it to the images array. If the frontend sends main imageUrl separately, that handles it.
  // product.imageUrl = newImageUrl; // Uncomment if you want the newly uploaded image to become the main one

  await product.save();
  res.json({ message: 'Image URL added successfully', imageUrl: newImageUrl, images: product.images });
});


export {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  reviewProduct,
  uploadProductImage,
};