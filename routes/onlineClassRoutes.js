import express from 'express';
import { getOnlineCatalog, getOnlineClassById } from '../controllers/onlineClassController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getOnlineCatalog);
router.get('/:id', authenticateToken, getOnlineClassById);

export default router;