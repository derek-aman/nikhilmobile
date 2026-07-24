import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipientType: { type: String, enum: ['CUSTOMER', 'ADMIN'], required: true },
    recipientId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Customer._id or Admin._id
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: String, // e.g. '/track-repair' or '/admin/appointments'
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

notificationSchema.index({ recipientType: 1, recipientId: 1, isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;