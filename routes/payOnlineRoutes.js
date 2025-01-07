import express from 'express';
import { 
    createPayment, 
    getPaymentStatus, 
    getUserPayments,
    updatePaymentStatus,
    confirmPayment // tambahkan ini
} from '../controllers/payOnlineController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', authenticateToken, createPayment);
router.get('/status/:paymentId', authenticateToken, getPaymentStatus);
router.get('/user-payments', authenticateToken, getUserPayments);
router.put('/status/:paymentId', authenticateToken, updatePaymentStatus);
router.post('/confirm/:paymentId', authenticateToken, confirmPayment); // tambahkan route ini

export default router;
