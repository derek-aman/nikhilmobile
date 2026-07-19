import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true }, // Clerk ka user ID
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String }
  },
  { timestamps: true }
);

const Customer = mongoose.model('Customer', customerSchema);
export default Customer;