import express from 'express';
import { createPayOrder, getPayOrderStatus } from '../controllers/payOrderController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', authMiddleware, createPayOrder);
router.get('/status/:orderId', authMiddleware, getPayOrderStatus);

export default router;
