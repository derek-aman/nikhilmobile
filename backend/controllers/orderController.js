import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { generateOrderId } from '../utils/generateOrderId.js';
import { getOrCreateCustomer } from './customerController.js';

// POST /api/orders  (protected - customer)
export const createOrder = async (req, res) => {
  try {
    const { items, notes } = req.body; // items: [{ productId, quantity }]

    if (!items?.length) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const productIds = items.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== items.length) {
      return res.status(400).json({ message: 'One or more products not found' });
    }

    // stock check + snapshot pricing
    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = products.find((p) => p._id.toString() === item.productId);
      if (product.stock < item.quantity) {
        return res.status(409).json({ message: `${product.name} is out of stock` });
      }
      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity
      });
      totalAmount += product.price * item.quantity;
    }

    const { userId } = req.auth();
    const customer = await getOrCreateCustomer(userId);

    const orderId = await generateOrderId();

    const order = await Order.create({
      orderId,
      customerId: customer._id,
      items: orderItems,
      totalAmount,
      notes
    });

    // decrement stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
    }
    await notifyAllAdmins({
        title: 'New Order',
        message: `${order.orderId} — new order received ($${totalAmount})`,
        link: '/admin/orders'
        });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create order', error: err.message });
  }
};

// GET /api/orders/:orderId  (public - order tracking)
export const getOrderByOrderId = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch order', error: err.message });
  }
};

// GET /api/orders  (admin only)
export const getOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const orders = await Order.find(filter).populate('customerId').sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
};

// PATCH /api/orders/:id/status  (admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    const populated = await order.populate('customerId');
    await notifyCustomer(populated.customerId, {
        title: 'Order Status Updated',
        message: `Your order ${order.orderId} is now: ${status.replace(/_/g, ' ')}`,
        link: '/track-order'
    });
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update order', error: err.message });
  }
};