import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import serviceRoutes from './routes/serviceRoutes.js';
import deviceRoutes from './routes/deviceRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import customerRoutes from './routes/customerRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import timeSlotRoutes from './routes/timeSlotRoutes.js';
import adminAuthRoutes from './routes/adminAuthRoutes.js';

import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';


dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());


app.use('/api/services', serviceRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/timeslots', timeSlotRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);



app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong' });
});

const PORT = process.env.PORT || 9090;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));