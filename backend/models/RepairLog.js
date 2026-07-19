import mongoose from 'mongoose';
import { RepairStatus } from '../constants/enums.js';

const repairLogSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true
    },
    status: { type: String, enum: RepairStatus, required: true },
    notes: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
  },
  { timestamps: true }
);

repairLogSchema.index({ appointmentId: 1 });

const RepairLog = mongoose.model('RepairLog', repairLogSchema);
export default RepairLog;