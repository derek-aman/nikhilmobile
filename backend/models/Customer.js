import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, unique: true, sparse: true }, // optional now
    email: { type: String }
  },
  { timestamps: true }
);

const Customer = mongoose.model('Customer', customerSchema);
export default Customer;