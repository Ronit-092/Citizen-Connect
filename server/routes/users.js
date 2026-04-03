import express from 'express';
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/')
  .get(authorize('government'), getAllUsers);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(authorize('government'), deleteUser);

export default router;