import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',   // Reference to the customer who placed the order
    required: true
  },
  orderItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      name: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true }
    }
  ],
  shippingAddress: {
    address: { type: String},
    city: { type: String},
    postalCode: { type: String},
    country: { type: String}
  },
  taxPrice: { type: Number, required: true, default: 0.0 },
  shippingPrice: { type: Number, required: true, default: 0.0 },
  totalPrice: { type: Number, required: true, default: 0.0 },
  paidAt: { type: Date,default:Date.now() },
  isDelivered: { type: Boolean, required: true, default: false },
  deliveredAt: { type: Date }
}, {
  timestamps: true
});

const ordersModel = mongoose.model('Order', orderSchema);
export default ordersModel