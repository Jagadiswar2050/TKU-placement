const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getStudentsList,
  getCompaniesList,
  toggleUserStatus,
  getNotifications,
  createNotification,
  deleteNotification,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Public or logged-in notification listing
router.get('/notifications', getNotifications);

// Admin-protected routes
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/students', getStudentsList);
router.get('/companies', getCompaniesList);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.post('/notifications', createNotification);
router.delete('/notifications/:id', deleteNotification);

module.exports = router;
