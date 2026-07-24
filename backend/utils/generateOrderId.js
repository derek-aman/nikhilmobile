import Order from '../models/Order.js';

export const generateOrderId = async () => {
  let orderId;
  let exists = true;
  while (exists) {
    const random = Math.floor(100000 + Math.random() * 900000);
    orderId = `ORD-${random}`;
    exists = await Order.exists({ orderId });
  }
  return orderId;
};