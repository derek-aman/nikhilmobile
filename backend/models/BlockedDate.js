import mongoose from 'mongoose';

const blockedDateSchema = new mongoose.Schema(
  {
    date: { type: String, required: true, unique: true },
    reason: String
  },
  { timestamps: true }
);

const BlockedDate = mongoose.model('BlockedDate', blockedDateSchema);
export default BlockedDate;