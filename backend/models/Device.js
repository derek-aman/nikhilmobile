import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    model: { type: String, required: true },
    imageUrl: String
  },
  { timestamps: true }
);

deviceSchema.index({ brand: 1, model: 1 }, { unique: true });

const Device = mongoose.model('Device', deviceSchema);
export default Device;