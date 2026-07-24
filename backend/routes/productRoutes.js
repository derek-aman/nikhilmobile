import express from 'express';
import { protectAdmin } from '../middleware/authMiddleware.js';
import {
  getProducts, getProductById, createProduct, updateProduct, toggleProductStatus, deleteProduct
} from '../controllers/productController.js';

const router = express.Router();
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protectAdmin, createProduct);
router.put('/:id', protectAdmin, updateProduct);
router.patch('/:id/toggle', protectAdmin, toggleProductStatus);
router.delete('/:id', protectAdmin, deleteProduct);

export default router;