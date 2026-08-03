import express from 'express';
import {
  getAnalytics,
  getAllUsers,
  updateUserStatus,
  getAllPayments,
  getAllContent,
  createContent,
  deleteContent
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/analytics', protect, isAdmin, getAnalytics);
router.get('/users', protect, isAdmin, getAllUsers);
router.put('/users/status', protect, isAdmin, updateUserStatus);
router.get('/payments', protect, isAdmin, getAllPayments);
router.get('/content', protect, isAdmin, getAllContent);
router.post('/content', protect, isAdmin, createContent);
router.delete('/content/:contentId', protect, isAdmin, deleteContent);

export default router;
