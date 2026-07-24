import TimeSlot from '../models/TimeSlot.js';

export const getTimeSlots = async (req, res) => {
  try {
    const slots = await TimeSlot.find({ isActive: true }).sort({ dayOfWeek: 1 });
    res.status(200).json(slots);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch time slots', error: err.message });
  }
};

export const createTimeSlot = async (req, res) => {
  try {
    const slot = await TimeSlot.create(req.body);
    res.status(201).json(slot);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create time slot', error: err.message });
  }
};