import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [3, 'Product name must be at least 3 characters long'],
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    imageUrl: {
      type: String,
      required: true,
      default: 'https://placehold.co/400x500/D81E05/FFFFFF?text=Product',
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
    },
    oldPrice: {
      type: Number,
      min: [0, 'Old price cannot be negative'],
      default: null,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
    isPromotional: {
      type: Boolean,
      default: false,
    },

    description: {
      type: String,
      required: [true, 'Product description is required'],
      minlength: [10, 'Description must be at least 10 characters long'],
    },
    brand: {
      type: String,
      required: [true, 'Product brand is required'],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    numReviews: {
      type: Number,
      min: 0,
      default: 0,
    },
    images: {
      type: [String],
      default: function() {
        return [this.imageUrl];
      },
    },
    specifications: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    sku: {
        type: String,
        unique: true,
        trim: true,
        uppercase: true,
        sparse: true,
    },
    tags: {
        type: [String],
        default: [],
        set: (v) => Array.isArray(v) ? v.map(tag => tag.trim().toLowerCase()) : [],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    soldCount: {
        type: Number,
        default: 0,
        min: 0,
    },

    agent: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Agent ID is required'],
      ref: 'User',
    },
    reviewStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      required: true,
    },
    rejectionReason: {
      type: String,
      required: function() { return this.reviewStatus === 'rejected'; },
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre('save', function(next) {
    if (this.isModified('imageUrl') || (this.isModified('images') && this.images[0] !== this.imageUrl)) {
        this.images[0] = this.imageUrl;
    }
    next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;