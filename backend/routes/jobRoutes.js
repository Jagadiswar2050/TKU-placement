const express = require('express');
const router = express.Router();
const {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getCompanyJobs,
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

// Public route to view all active jobs
router.get('/', getAllJobs);

// Private company routes (must come before /:id)
router.get('/my-jobs', protect, authorize('company', 'admin'), getCompanyJobs);
router.post('/', protect, authorize('company', 'admin'), createJob);

// Single job route
router.get('/:id', getJobById);
router.put('/:id', protect, authorize('company', 'admin'), updateJob);
router.delete('/:id', protect, authorize('company', 'admin'), deleteJob);

module.exports = router;
