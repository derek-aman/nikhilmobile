import mongoose from 'mongoose';

const backSkinSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' },
    price: { type: Number, required: true },
    imageUrl: String,
    inStock: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const BackSkin = mongoose.model('BackSkin', backSkinSchema);
export default BackSkin;