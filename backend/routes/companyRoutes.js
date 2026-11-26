const express = require('express');
const router = express.Router();
const {
  getCompanyProfile,
  updateCompanyProfile,
  getAllCompanies,
} = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/auth');

// Public route to view company directory
router.get('/', getAllCompanies);

// Recruiter routes
router.get('/profile', protect, authorize('company', 'admin'), getCompanyProfile);
router.put('/profile', protect, authorize('company', 'admin'), updateCompanyProfile);

module.exports = router;
