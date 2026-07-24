import Notification from '../models/Notification.js';
import { getOrCreateCustomer } from './customerController.js';

// GET /api/notifications  (customer)
export const getCustomerNotifications = async (req, res) => {
  try {
    const { userId } = req.auth();
    const customer = await getOrCreateCustomer(userId);
    const notifications = await Notification.find({ recipientType: 'CUSTOMER', recipientId: customer._id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notifications', error: err.message });
  }
};

// GET /api/admin/notifications  (admin)
export const getAdminNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipientType: 'ADMIN', recipientId: req.admin.id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notifications', error: err.message });
  }
};

// PATCH /api/notifications/:id/read  (both)
export const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.status(200).json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update', error: err.message });
  }
};