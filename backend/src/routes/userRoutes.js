import express from 'express';
import { updateProfile, updatePassword, getBillingHistory } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.get('/billing', protect, getBillingHistory);

export default router;
