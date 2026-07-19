// controllers/clerkWebhookController.js
import Customer from '../models/Customer.js';

export const handleClerkWebhook = async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type === 'user.created') {
      await Customer.create({
        clerkId: data.id,
        name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
        phone: data.phone_numbers?.[0]?.phone_number || '',
        email: data.email_addresses?.[0]?.email_address || ''
      });
    }

    res.status(200).json({ received: true });
  } catch (err) {
    res.status(500).json({ message: 'Webhook processing failed', error: err.message });
  }
};