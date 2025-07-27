import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

const createProduct = asyncHandler(async (req, res) => {
  const {
    name, price, imageUrl, category, oldPrice, isNew, isTrending,
    isPromotional, description, brand, stock, images, specifications,
    sku, tags, isActive
  } = req.body;

  const agentId = req.user._id;

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
    isNew,
    isTrending,
    isPromotional,
    description,
    brand,
    stock: stock || 0,
    images: images && images.length > 0 ? images : [finalImageUrl],
    specifications: specifications || {},
    sku,
    tags,
    isActive,
    agent: agentId,
    reviewStatus: 'pending',
    rejectionReason: null,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

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

  // Removed ': any' type annotation as it's a JavaScript file
  let findQuery = {
    ...keyword,
    ...category,
    ...brand,
    reviewStatus: 'approved',
    isActive: true,
  };

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
      if (req.query.isActive !== undefined) {
        findQuery.isActive = req.query.isActive === 'true';
      }
    } else if (req.user.role === 'agent') {
      findQuery.agent = req.user._id;
      delete findQuery.reviewStatus;
      if (req.query.reviewStatus && req.query.reviewStatus !== 'all') {
        findQuery.reviewStatus = req.query.reviewStatus;
      }
      if (req.query.isActive !== undefined) {
          findQuery.isActive = req.query.isActive === 'true';
      } else {
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
        throw new new Error('Product not found or not available for public viewing');
      }
    }
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

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
    product.images = images && images.length > 0 ? images : [product.imageUrl];
    product.specifications = specifications !== undefined ? specifications : product.specifications;
    product.sku = sku || product.sku;
    product.tags = tags !== undefined ? tags : product.tags;
    product.isActive = isActive !== undefined ? isActive : product.isActive;

    if (isOwner && !isAdmin && product.reviewStatus === 'approved') {
        product.reviewStatus = 'pending';
        product.rejectionReason = null;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    const isAdmin = req.user.role === 'admin';
    const isOwner = product.agent.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      res.status(403);
      throw new Error('Not authorized to delete this product');
    }

    product.isActive = false;
    await product.save();
    res.json({ message: 'Product marked as inactive (soft deleted)' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

const reviewProduct = asyncHandler(async (req, res) => {
    const { status, reason } = req.body;
    const productId = req.params.id;
    const product = await Product.findById(productId).populate('agent', 'email');

    if (product) {
        if (status === 'approved' || status === 'rejected') {
            const oldStatus = product.reviewStatus;

            product.reviewStatus = status;
            product.rejectionReason = status === 'rejected' ? reason : null;

            if (status === 'rejected' && !reason) {
                res.status(400);
                throw new Error('Rejection reason is required when status is rejected');
            }

            const updatedProduct = await product.save();

            if (oldStatus !== status) {
                let notificationMessage;
                let notificationType;

                if (status === 'approved') {
                    notificationMessage = `Your product "${product.name}" has been approved! It is now live on the marketplace.`;
                    notificationType = 'approval';
                } else if (status === 'rejected') {
                    notificationMessage = `Your product "${product.name}" was rejected. Reason: ${reason || 'No specific reason provided.'}`;
                    notificationType = 'rejection';
                }

                if (notificationMessage && product.agent) {
                    await Notification.create({
                        agent: product.agent._id,
                        type: notificationType,
                        message: notificationMessage,
                        product: updatedProduct._id,
                    });
                    console.log(`Notification sent to agent ${product.agent._id} for product ${updatedProduct._id}`);
                }
            }

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

export {
  getPersonalizedRecommendations,
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  reviewProduct,
  uploadProductImage,
};
