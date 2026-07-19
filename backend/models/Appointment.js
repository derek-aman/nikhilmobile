import mongoose from 'mongoose';
import { RepairStatus } from '../constants/enums.js';

const appointmentSchema = new mongoose.Schema(
  {
    bookingId: { type: String, unique: true, required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' },

    serviceIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    backSkinId: { type: mongoose.Schema.Types.ObjectId, ref: 'BackSkin' },

    date: { type: String, required: true },
    timeSlot: { type: String, required: true },

    status: {
      type: String,
      enum: RepairStatus,
      default: 'BOOKED'
    },

    notes: String,
    estimatedCost: { type: Number, required: true }, // snapshot at booking time
    finalCost: Number,
    estimatedCompletion: String,
    isWalkIn: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// speeds up admin dashboard's "today" + status filter queries
appointmentSchema.index({ date: 1, status: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;