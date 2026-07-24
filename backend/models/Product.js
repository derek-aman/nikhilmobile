import mongoose from 'mongoose';
import { ProductCategory } from '../constants/enums.js';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, enum: ProductCategory, required: true },
    description: String,
    price: { type: Number, required: true },
    compatibleWith: String, // e.g. "iPhone 15 Pro Max" — for skins/cases
    imageUrl: String,
    stock: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });

const Product = mongoose.model('Product', productSchema);
export default Product;