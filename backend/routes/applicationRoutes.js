const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
  getAllApplications,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// Student routes
router.post('/apply/:jobId', authorize('student'), applyForJob);
router.get('/my-applications', authorize('student'), getMyApplications);

// Company & Admin routes
router.get('/job/:jobId', authorize('company', 'admin'), getJobApplicants);
router.put('/:id/status', authorize('company', 'admin'), updateApplicationStatus);

// Admin-only route
router.get('/all', authorize('admin'), getAllApplications);

module.exports = router;
