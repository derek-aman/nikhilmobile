import Appointment from '../models/Appointment.js';
import Service from '../models/Service.js';
import TimeSlot from '../models/TimeSlot.js';
import BlockedDate from '../models/BlockedDate.js';
import { generateBookingId } from '../utils/generateBookingId.js';
import { getOrCreateCustomer } from './customerController.js';

// POST /api/appointments  (protected - customer)
export const createAppointment = async (req, res) => {
  try {
    const { deviceId, serviceIds, date, timeSlot, backSkinId, notes, isWalkIn } = req.body;

    if (!deviceId || !serviceIds?.length || !date || !timeSlot) {
      return res.status(400).json({ message: 'Missing required booking fields' });
    }

    // check date isn't blocked
    const isBlocked = await BlockedDate.findOne({ date });
    if (isBlocked) {
      return res.status(400).json({ message: `This date is unavailable: ${isBlocked.reason || 'closed'}` });
    }

    // check slot capacity (atomic-ish check)
    const dayOfWeek = new Date(date).getDay();
    const slotConfig = await TimeSlot.findOne({ dayOfWeek, startTime: timeSlot, isActive: true });
    if (!slotConfig) {
      return res.status(400).json({ message: 'Selected time slot is not available' });
    }

    const existingBookingsCount = await Appointment.countDocuments({
      date,
      timeSlot,
      status: { $nin: ['CANCELLED'] }
    });

    if (existingBookingsCount >= slotConfig.maxBookings) {
      return res.status(409).json({ message: 'This time slot is fully booked, please choose another' });
    }

    // calculate cost snapshot from current service prices
    const services = await Service.find({ _id: { $in: serviceIds } });
    if (services.length !== serviceIds.length) {
      return res.status(400).json({ message: 'One or more services not found' });
    }
    const estimatedCost = services.reduce((sum, s) => sum + s.priceMin, 0);

    // resolve customer (Clerk-authenticated, unless walk-in created by admin)
    let customerId;
    if (isWalkIn && req.admin) {
      customerId = req.body.customerId; // admin provides existing customer or creates one separately
    } else {
      const customer = await getOrCreateCustomer(req.auth.userId);
      customerId = customer._id;
    }

    const bookingId = await generateBookingId();

    const appointment = await Appointment.create({
      bookingId,
      customerId,
      deviceId,
      serviceIds,
      backSkinId,
      date,
      timeSlot,
      estimatedCost,
      notes,
      isWalkIn: !!isWalkIn
    });

    const populated = await appointment.populate(['deviceId', 'serviceIds']);
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create appointment', error: err.message });
  }
};

// GET /api/appointments/:bookingId  (public - for status tracking)
export const getAppointmentByBookingId = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ bookingId: req.params.bookingId })
      .populate('deviceId')
      .populate('serviceIds');

    if (!appointment) return res.status(404).json({ message: 'Booking not found' });
    res.status(200).json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch appointment', error: err.message });
  }
};

// GET /api/appointments  (admin only - dashboard list)
export const getAppointments = async (req, res) => {
  try {
    const { date, status } = req.query;
    const filter = {};
    if (date) filter.date = date;
    if (status) filter.status = status;

    const appointments = await Appointment.find(filter)
      .populate('customerId')
      .populate('deviceId')
      .populate('serviceIds')
      .sort({ date: 1, timeSlot: 1 });

    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch appointments', error: err.message });
  }
};

// PATCH /api/appointments/:id/status  (admin only)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.status(200).json(appointment);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update status', error: err.message });
  }
};