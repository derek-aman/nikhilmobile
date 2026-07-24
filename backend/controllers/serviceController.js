import Service from '../models/Service.js';

// GET /api/services  (public - customer facing)
export const getServices = async (req, res) => {
  try {
    const { category, activeOnly } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (activeOnly === 'true') filter.isActive = true;

    const services = await Service.find(filter).sort({ createdAt: -1 });
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch services', error: err.message });
  }
};

// GET /api/services/:id
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.status(200).json(service);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch service', error: err.message });
  }
};

// POST /api/services  (admin only)
export const createService = async (req, res) => {
  try {
    if (Number(req.body.priceMax) < Number(req.body.priceMin)) {
      return res.status(400).json({ message: 'priceMax must be >= priceMin' });
    }
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create service', error: err.message });
  }
};

// PUT /api/services/:id  (admin only)
export const updateService = async (req, res) => {
  try {
    if (req.body.priceMin !== undefined && req.body.priceMax !== undefined) {
      if (Number(req.body.priceMax) < Number(req.body.priceMin)) {
        return res.status(400).json({ message: 'priceMax must be >= priceMin' });
      }
    }
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.status(200).json(service);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update service', error: err.message });
  }
};

// PATCH /api/services/:id/toggle  (admin only)
export const toggleServiceStatus = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    service.isActive = !service.isActive;
    await service.save();
    res.status(200).json(service);
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle service', error: err.message });
  }
};

// DELETE /api/services/:id  (admin only)
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.status(200).json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete service', error: err.message });
  }
};