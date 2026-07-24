import express from 'express';
import { protectAdmin } from '../middleware/authMiddleware.js';
import {
  getDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice
} from '../controllers/deviceController.js';

const router = express.Router();

router.get('/', getDevices);
router.get('/:id', getDeviceById);
router.post('/', protectAdmin, createDevice);
router.put('/:id', protectAdmin, updateDevice);
router.delete('/:id', protectAdmin, deleteDevice);

export default router;