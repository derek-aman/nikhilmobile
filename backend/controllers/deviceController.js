import Device from '../models/Device.js';

// GET /api/devices  (public - used in booking flow's device selection step)
export const getDevices = async (req, res) => {
  try {
    const { brand } = req.query;
    const filter = {};
    if (brand) filter.brand = brand;

    const devices = await Device.find(filter).sort({ brand: 1, model: 1 });
    res.status(200).json(devices);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch devices', error: err.message });
  }
};

// GET /api/devices/:id
export const getDeviceById = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) return res.status(404).json({ message: 'Device not found' });
    res.status(200).json(device);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch device', error: err.message });
  }
};

// POST /api/devices  (admin only)
export const createDevice = async (req, res) => {
  try {
    const device = await Device.create(req.body);
    res.status(201).json(device);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'This brand + model already exists' });
    }
    res.status(400).json({ message: 'Failed to create device', error: err.message });
  }
};

// PUT /api/devices/:id  (admin only)
export const updateDevice = async (req, res) => {
  try {
    const device = await Device.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!device) return res.status(404).json({ message: 'Device not found' });
    res.status(200).json(device);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update device', error: err.message });
  }
};

// DELETE /api/devices/:id  (admin only)
export const deleteDevice = async (req, res) => {
  try {
    const device = await Device.findByIdAndDelete(req.params.id);
    if (!device) return res.status(404).json({ message: 'Device not found' });
    res.status(200).json({ message: 'Device deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete device', error: err.message });
  }
};