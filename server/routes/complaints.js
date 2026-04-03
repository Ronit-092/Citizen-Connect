import express from 'express';
import {
  createComplaint,
  getAllComplaints,
  getComplaint,
  updateComplaint,
  deleteComplaint,
  updateComplaintStatus,
  addRemark,
  getMyComplaints,
  getComplaintsByStatus,
  getComplaintStatistics,
  toggleUpvote,
  updatePriority,
  assignComplaint,
  searchComplaints,
  bulkUpdateComplaints,
  getAnalytics
} from '../controllers/complaintController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Public endpoint - no auth required, returns all complaints
router.get('/public', getAllComplaints);

// Analytics (government only)
router.get('/analytics', protect, authorize('government'), getAnalytics);

// Statistics (government only)
router.get('/statistics', protect, authorize('government'), getComplaintStatistics);

// Search (both roles)
router.get('/search', protect, searchComplaints);

// Bulk update (government only)
router.patch('/bulk', protect, authorize('government'), bulkUpdateComplaints);

// Get complaints by status (government)
router.get('/status/:status', protect, authorize('government'), getComplaintsByStatus);

// Get my complaints (citizen)
router.get('/my-complaints', protect, authorize('citizen'), getMyComplaints);

// CRUD operations
router.route('/')
  .get(protect, getAllComplaints)
  .post(protect, authorize('citizen'), upload.single('image'), createComplaint);

router.route('/:id')
  .get(protect, getComplaint)
  .put(protect, updateComplaint)
  .delete(protect, deleteComplaint);

// Status update (government only)
router.put('/:id/status', protect, authorize('government'), updateComplaintStatus);

// Priority update (government only)
router.patch('/:id/priority', protect, authorize('government'), updatePriority);

// Assign complaint (government only)
router.patch('/:id/assign', protect, authorize('government'), assignComplaint);

// Add remark (government only)
router.post('/:id/remarks', protect, authorize('government'), addRemark);

// Toggle upvote (citizen only)
router.post('/:id/upvote', protect, authorize('citizen'), toggleUpvote);

export default router;