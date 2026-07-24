import Notification from '../models/Notification.js';
import Admin from '../models/Admin.js';
import { sendEmail } from './sendEmail.js';

export const notifyCustomer = async (customer, { title, message, link }) => {
  await Notification.create({
    recipientType: 'CUSTOMER',
    recipientId: customer._id,
    title,
    message,
    link
  });
  await sendEmail({ to: customer.email, subject: title, text: message });
};

export const notifyAllAdmins = async ({ title, message, link }) => {
  const admins = await Admin.find({});
  await Promise.all(
    admins.map(async (admin) => {
      await Notification.create({
        recipientType: 'ADMIN',
        recipientId: admin._id,
        title,
        message,
        link
      });
      // admins don't have email in schema currently — skipping email for admin, in-app only
    })
  );
};