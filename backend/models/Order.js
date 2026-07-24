import mongoose from 'mongoose';
import { OrderStatus } from '../constants/enums.js';

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,        // snapshot at order time
  price: Number,        // snapshot at order time
  quantity: { type: Number, required: true, min: 1 }
}, { _id: false });

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true, required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: OrderStatus, default: 'PENDING' },
    notes: String
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;