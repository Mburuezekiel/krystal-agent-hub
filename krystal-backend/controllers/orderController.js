import Order from '../models/orderModel.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId).populate('cart.product');

    if (!user || user.cart.length === 0) {
      return res.status(400).json({ message: 'Cannot place an order with an empty cart.' });
    }

    // Prepare order items and check stock
    let subtotal = 0;
    const orderItems = [];

    for (const cartItem of user.cart) {
      const product = await Product.findById(cartItem.product._id);

      if (!product) {
        return res.status(404).json({ message: `Product not found: ${cartItem.product.name}` });
      }

      if (product.stock < cartItem.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}. Only ${product.stock} left.` });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.price,
        quantity: cartItem.quantity,
      });

      subtotal += product.price * cartItem.quantity;

      // Decrement product stock and save
      product.stock -= cartItem.quantity;
      await product.save();
    }

    const shippingCost = subtotal > 5000 ? 0 : 300;
    const totalAmount = subtotal + shippingCost;

    // Create the new order
    const newOrder = new Order({
      user: userId,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingCost,
      totalAmount,
      status: 'processing',
    });

    const createdOrder = await newOrder.save();

    // Clear the user's cart after successful order
    user.cart = [];
    await user.save();

    res.status(201).json({
      message: 'Order placed successfully!',
      order: createdOrder,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Failed to create order.' });
  }
};

// @desc    Get all orders for the authenticated user
// @route   GET /api/orders
// @access  Private
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name imageUrl price');

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'You have not placed any orders yet.' });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Failed to fetch orders.' });
  }
};

// @desc    Get all orders (Admin access only)
// @route   GET /api/orders/all
// @access  Private (Admin)
export const getAllOrders = async (req, res) => {
  try {
    // We don't filter by user here. We get all orders.
    // The .populate() method is used to include user and product details.
    const orders = await Order.find({})
      .populate('user', 'name email') // Populates the 'user' field with name and email
      .populate('items.product', 'name imageUrl price') // Populates product details
      .sort({ createdAt: -1 }); // Sorts by most recent first

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found.' });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Failed to fetch all orders.' });
  }
};