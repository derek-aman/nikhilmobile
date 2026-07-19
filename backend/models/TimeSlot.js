import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema(
  {
    dayOfWeek: { type: Number, min: 0, max: 6, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    maxBookings: { type: Number, required: true, default: 3 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

timeSlotSchema.index({ dayOfWeek: 1 });

const TimeSlot = mongoose.model('TimeSlot', timeSlotSchema);
export default TimeSlot;