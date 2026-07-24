import mongoose from 'mongoose';
import dotenv from 'dotenv';
import TimeSlot from '../models/TimeSlot.js';

dotenv.config();

// Demo mein dikhe slots: 10:00, 11:00, 13:00, 14:00, 15:30, 17:00
const TIME_SLOTS = ['10:00', '11:00', '13:00', '14:00', '15:30', '17:00'];

// 0 = Sunday, 1 = Monday, ... 6 = Saturday
// Mon-Fri: 09:00-19:00, Sat: 10:00-17:00, Sun: closed (demo ke hisaab se)
const WORKING_DAYS = [1, 2, 3, 4, 5, 6]; // Monday to Saturday

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  await TimeSlot.deleteMany({}); // clean slate, avoid duplicates on re-run
  console.log('🗑️  Cleared existing time slots');

  const slotsToCreate = [];

  for (const day of WORKING_DAYS) {
    for (let i = 0; i < TIME_SLOTS.length - 1; i++) {
      slotsToCreate.push({
        dayOfWeek: day,
        startTime: TIME_SLOTS[i],
        endTime: TIME_SLOTS[i + 1],
        maxBookings: day === 6 ? 2 : 3, // Saturday thoda kam capacity, demo jaisa
        isActive: true
      });
    }
    // last slot ka end time manually (17:00 ke baad koi next slot nahi, so close karte hain +1hr assume kar ke)
    slotsToCreate.push({
      dayOfWeek: day,
      startTime: TIME_SLOTS[TIME_SLOTS.length - 1],
      endTime: '18:00',
      maxBookings: day === 6 ? 2 : 3,
      isActive: true
    });
  }

  await TimeSlot.insertMany(slotsToCreate);
  console.log(`✅ Created ${slotsToCreate.length} time slots (Mon-Sat)`);

  process.exit();
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});