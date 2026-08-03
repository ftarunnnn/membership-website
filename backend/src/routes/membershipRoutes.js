import express from 'express';
import { getAllPlans, getProtectedContent, cancelSubscription } from '../controllers/membershipController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/plans', getAllPlans);
router.get('/content', protect, getProtectedContent);
router.post('/cancel', protect, cancelSubscription);

export default router;
