import mongoose from 'mongoose';

const CartItemSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Reference to your Product model
    required: true,
  },
  name: { // Store product name for easier display without populating product
    type: String,
    required: true,
  },
  imageUrl: { // Store product image for easier display
    type: String,
    required: true,
  },
  price: { // Store price at the time of adding to cart
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
}, {
  _id: false // Do not create an _id for subdocuments
});

const CartSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to your User model (assuming you have one)
      required: true,
      unique: true, // Each user can only have one cart
    },
    items: [CartItemSchema], // Array of products in the cart
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const Cart = mongoose.model('Cart', CartSchema);

export default Cart;
