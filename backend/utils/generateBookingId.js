import Appointment from '../models/Appointment.js';

export const generateBookingId = async () => {
  const prefix = 'FIX';
  let bookingId;
  let exists = true;

  while (exists) {
    const random = Math.floor(100000 + Math.random() * 900000);
    bookingId = `${prefix}-${random}`;
    exists = await Appointment.exists({ bookingId });
  }

  return bookingId;
};