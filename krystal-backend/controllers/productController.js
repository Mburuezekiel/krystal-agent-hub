import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import Notification from '../models/Notification.js'; // Assuming you have a Notification model
import User from '../models/User.js'; // Assuming you have a User model to get agent details

// Helper function to create a notification
const createAgentNotification = async (agentId, type, message, productId = null) => {
  try {
    const notification = new Notification({
      agent: agentId,
      type,
      message,
      product: productId,
    });
    await notification.save();
    console.log(`Notification created for agent ${agentId}: ${message}`);
  } catch (error) {
    console.error('Failed to create notification:', error);
    // Do not throw error here, as notification failure should not block product operation
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Agent
const createProduct = asyncHandler(async (req, res) => {
  const {
    name, price, imageUrl, category, oldPrice, isNew, isTrending,
    isPromotional, description, brand, stock, images, specifications,
    sku, tags, isActive
  } = req.body;

  const agentId = req.user._id; // req.user is populated by the protect middleware

  if (!name || !price || !category || !description || !brand) {
    res.status(400);
    throw new Error('Please fill all required product fields: name, price, category, description, brand.');
  }

  const defaultImageUrl = 'https://placehold.co/400x500/D81E05/FFFFFF?text=Product';
  const finalImageUrl = imageUrl || defaultImageUrl;

  const product = new Product({
    name,
    price,
    imageUrl: finalImageUrl,
    category,
    oldPrice,
    isNew: isNew !== undefined ? isNew : false,
    isTrending: isTrending !== undefined ? isTrending : false,
    isPromotional: isPromotional !== undefined ? isPromotional : false,
    description,
    brand,
    stock: stock !== undefined ? stock : 0,
    images: images && images.length > 0 ? images : [finalImageUrl],
    specifications: specifications || {},
    sku,
    tags: tags || [],
    isActive: isActive !== undefined ? isActive : true,
    agent: agentId,
    reviewStatus: 'pending',
    rejectionReason: null,
  });

  const createdProduct = await product.save();

  // --- Notification for Product Creation ---
  await createAgentNotification(
    agentId,
    'product_update', // Using 'product_update' type for creation too
    `Your product "${createdProduct.name}" has been submitted for review.`,
    createdProduct._id
  );

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

  let findQuery = {
    ...keyword,
    ...category,
    ...brand,
  };

  findQuery.reviewStatus = 'approved';
  findQuery.isActive = true;

  if (req.query.isNew === 'true') {
    findQuery.isNew = true;
  }
  if (req.query.isTrending === 'true') {
    findQuery.isTrending = true;
  }
  if (req.query.isPromotional === 'true') {
    findQuery.isPromotional = true;
  }

  if (req.query.personalized === 'true' || req.query.userId) {
    findQuery.reviewStatus = 'approved';
    findQuery.isActive = true;

    const totalApprovedActiveProducts = await Product.countDocuments(findQuery);
    if (totalApprovedActiveProducts === 0) {
      return res.json({ products: [], page: 1, pages: 1, totalCount: 0 });
    }

    const maxSkip = Math.max(0, totalApprovedActiveProducts - pageSize);
    const randomSkip = Math.floor(Math.random() * (maxSkip + 1));

    const products = await Product.find(findQuery)
      .populate('agent', 'firstName lastName email userName')
      .skip(randomSkip)
      .limit(pageSize);

    return res.json({ products, page: 1, pages: 1, totalCount: products.length });
  }

  if (req.user) {
    if (req.user.role === 'admin') {
      delete findQuery.reviewStatus;
      delete findQuery.isActive;

      if (req.query.reviewStatus && req.query.reviewStatus !== 'all') {
        findQuery.reviewStatus = req.query.reviewStatus;
      }
      if (req.query.isActive !== undefined && req.query.isActive !== 'all') {
        findQuery.isActive = req.query.isActive === 'true';
      } else if (req.query.isActive === 'all') {
        delete findQuery.isActive;
      }

    } else if (req.user.role === 'agent') {
      findQuery.agent = req.user._id;
      delete findQuery.reviewStatus;
      delete findQuery.isActive;

      if (req.query.reviewStatus && req.query.reviewStatus !== 'all') {
        findQuery.reviewStatus = req.query.reviewStatus;
      }
      if (req.query.isActive !== undefined && req.query.isActive !== 'all') {
        findQuery.isActive = req.query.isActive === 'true';
      } else if (req.query.isActive === 'all') {
        delete findQuery.isActive;
      }
    }
  }

  const count = await Product.countDocuments(findQuery);

  const products = await Product.find(findQuery)
    .populate('agent', 'firstName lastName email userName')
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({ products, page, pages: Math.ceil(count / pageSize), totalCount: count });
});

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public (if approved/active), Private/Admin, Private/Agent (if owner)
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('agent', 'firstName lastName email userName');

  if (product) {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'agent')) {
      if (req.user.role === 'agent' && product.agent.toString() !== req.user._id.toString()) {
        if (product.reviewStatus !== 'approved' || !product.isActive) {
          res.status(404);
          throw new Error('Product not found or not available for public viewing');
        }
      }
      res.json(product);
    } else {
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
    const originalReviewStatus = product.reviewStatus; // Store original status

    if (!isAdmin && !isOwner) {
      res.status(403);
      throw new Error('Not authorized to update this product');
    }

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
    if (isOwner && !isAdmin && product.reviewStatus === 'approved') {
        product.reviewStatus = 'pending';
        product.rejectionReason = null; // Clear rejection reason on agent update
    }

    const updatedProduct = await product.save();

    // --- Notification for Product Update ---
    if (isOwner) { // Agent updated their own product
        if (originalReviewStatus === 'approved' && updatedProduct.reviewStatus === 'pending') {
             await createAgentNotification(
                product.agent,
                'product_update',
                `Your product "${updatedProduct.name}" has been updated and is now pending re-review.`,
                updatedProduct._id
            );
        } else {
             await createAgentNotification(
                product.agent,
                'product_update',
                `Your product "${updatedProduct.name}" has been updated.`,
                updatedProduct._id
            );
        }
    } else if (isAdmin) { // Admin updated product (can be any change, including status change)
        // You might want more specific notifications if admin changes reviewStatus via this route
        // For now, a general update notification
         await createAgentNotification(
            product.agent,
            'product_update',
            `Admin updated your product "${updatedProduct.name}".`,
            updatedProduct._id
        );
    }

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
  const product = await Product.findById(req.params.id).populate('agent', 'userName'); // Populate agent to get their userName for message

  if (product) {
    const isAdmin = req.user.role === 'admin';
    const isOwner = product.agent._id.toString() === req.user._id.toString(); // Use product.agent._id now that it's populated

    if (!isAdmin && !isOwner) {
      res.status(403);
      throw new Error('Not authorized to delete this product');
    }

    product.isActive = false; // Mark product as inactive
    await product.save();

    // --- Notification for Product Soft Delete ---
    await createAgentNotification(
      product.agent._id, // Use the actual agent ID from the populated product
      'product_update', // Or a new type like 'product_deleted' if you add it to schema
      `Your product "${product.name}" has been marked as inactive.`,
      product._id
    );

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

    if (!isAdmin && !isOwner) {
      res.status(403);
      throw new Error('Not authorized to upload images for this product');
    }

    const newImageUrl = req.body.imageUrl || `https://placehold.co/400x500/0000FF/FFFFFF?text=Image-${Date.now()}`;

    if (!product.images.includes(newImageUrl)) {
        product.images.push(newImageUrl);
    }
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
    const limit = parseInt(req.query.limit) || 8;
    console.log(`Backend: Attempting to fetch ${limit} active and approved products for recommendations.`);

    const products = await Product.find({
      isActive: true,
      reviewStatus: 'approved'
    })
    .limit(limit)
    .lean();

    console.log(`Backend: Found ${products ? products.length : 0} active and approved products for recommendations.`);

    if (!products || products.length === 0) {
      console.log('Backend: No active and approved products found for recommendations.');
      return res.status(200).json({ products: [], page: 1, pages: 1, totalCount: 0 });
    }

    const shuffledProducts = products.sort(() => 0.5 - Math.random());

    res.status(200).json({
      products: shuffledProducts,
      page: 1,
      pages: 1,
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
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

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
    .populate('agent', 'firstName lastName userName email')
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize), totalCount: count });
});

// @desc    Review a product (approve/reject)
// @route   PUT /api/products/:id/review
// @access  Private/Admin
const reviewProduct = asyncHandler(async (req, res) => {
  const { status, reason } = req.body;
  const { id } = req.params;

  const product = await Product.findById(id).populate('agent', 'userName'); // Populate agent to get their ID for notification

  if (product) {
    const originalReviewStatus = product.reviewStatus; // Store original status for comparison

    if (status === 'approved') {
      product.reviewStatus = 'approved';
      product.rejectionReason = undefined;

      // --- Notification for Product Approval ---
      if (originalReviewStatus !== 'approved') { // Only send if status actually changed
          await createAgentNotification(
            product.agent._id,
            'approval',
            `Your product "${product.name}" has been approved! It is now live on the marketplace.`,
            product._id
          );
      }

    } else if (status === 'rejected') {
      if (!reason) {
        res.status(400);
        throw new Error('Rejection reason is required for rejected status.');
      }
      product.reviewStatus = 'rejected';
      product.rejectionReason = reason;

      // --- Notification for Product Rejection ---
      if (originalReviewStatus !== 'rejected') { // Only send if status actually changed
          await createAgentNotification(
            product.agent._id,
            'rejection',
            `Your product "${product.name}" has been rejected. Reason: ${reason}`,
            product._id
          );
      }
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
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const agentId = req.user._id;

  const keyword = req.query.keyword
    ? {
        $or: [
          { name: { $regex: req.query.keyword, $options: 'i' } },
          { brand: { $regex: req.query.keyword, $options: 'i' } },
        ],
      }
    : {};

  const statusFilter = req.query.reviewStatus;
  const filter = { ...keyword, agent: agentId };

  if (statusFilter && statusFilter !== 'all') {
    filter.reviewStatus = statusFilter;
  }

  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate('agent', 'firstName lastName userName email')
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