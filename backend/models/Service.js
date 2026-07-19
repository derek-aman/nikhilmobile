import mongoose from 'mongoose';
import { ServiceCategory } from '../constants/enums.js';

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, enum: ServiceCategory, required: true },
    description: String,
    priceMin: { type: Number, required: true },
    priceMax: {
      type: Number,
      required: true,
      validate: {
        validator: function (v) {
          return v >= this.priceMin;
        },
        message: 'priceMax must be greater than or equal to priceMin'
      }
    },
    durationMinutes: Number,
    warranty: String,
    isActive: { type: Boolean, default: true },
    imageUrl: String
  },
  { timestamps: true }
);

const Service = mongoose.model('Service', serviceSchema);
export default Service;