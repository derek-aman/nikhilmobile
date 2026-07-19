import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await Admin.findOne({ phone: '9798186837' }); // uncle ka number daal
  if (existing) {
    console.log('Admin already exists');
    process.exit();
  }

  await Admin.create({
    name: 'Bittu Pa',
    phone: '9798186837',
    password: 'Aman@262002', // temp password, baad me khud change kar denge
    role: 'OWNER'
  });

  console.log('✅ Admin created');
  process.exit();
};

seed();