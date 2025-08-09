import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true
  },
  description: {
    type: String,
    required: [true, "Product description is required"],
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categorie',
    required: [true, "Product category is required"]
  },
  quality: {
    type: String,
    required: [true, "Product quality is required"],
    enum: ["New", "Like New", "Refurbished", "Used - Good", "Used - Acceptable", "Damaged"]
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    min: 0
  },
  quantity: {
    type: Number,
    required: [true, "Product quantity is required"],
    min: 0,
    default: 0
  },
  mainImage: {
    type: String,
    required: [true, "Main product image is required"]
  },
  extraImages: {
    type: [String],
    default: []
  },
  inStock: {
    type: Boolean,
    default: function() {
      return this.quantity > 0;
    }
  },
  inRecomendations:Boolean,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
 reviews: [
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    review: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
]
}, { timestamps: true });

// Update inStock whenever quantity changes
productSchema.pre('save', function(next) {
  this.inStock = this.quantity > 0;
  next();
});

const Product = mongoose.model("Product", productSchema);

export default Product;