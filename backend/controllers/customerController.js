import Customer from '../models/Customer.js';
import { clerkClient } from '@clerk/express';

// Helper - kahin bhi use hoga jahan customer record chahiye
export const getOrCreateCustomer = async (clerkUserId) => {
  let customer = await Customer.findOne({ clerkId: clerkUserId });
  if (customer) return customer;

  // Clerk se user details fetch kar
  const clerkUser = await clerkClient.users.getUser(clerkUserId);

  customer = await Customer.create({
    clerkId: clerkUserId,
    name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Customer',
    phone: clerkUser.phoneNumbers?.[0]?.phoneNumber || '',
    email: clerkUser.emailAddresses?.[0]?.emailAddress || ''
  });

  return customer;
};

// GET /api/customers/me  (protected - customer apni profile dekh sake)
export const getMyProfile = async (req, res) => {
  try {
    const customer = await getOrCreateCustomer(req.auth.userId);
    res.status(200).json(customer);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
};