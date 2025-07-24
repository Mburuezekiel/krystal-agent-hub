import mongoose from 'mongoose';

const WishlistItemSchema = mongoose.Schema({
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
  price: { // Store price at the time of adding to wishlist
    type: Number,
    required: true,
    min: 0,
  },
}, {
  _id: false // Do not create an _id for subdocuments
});

const WishlistSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to your User model
      required: true,
      unique: true, // Each user can only have one wishlist
    },
    items: [WishlistItemSchema], // Array of products in the wishlist
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const Wishlist = mongoose.model('Wishlist', WishlistSchema);

export default Wishlist;
