const mongoose = require('mongoose');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const CompanyProfile = require('../models/CompanyProfile');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const memoryStore = require('../config/inMemoryStore');

// @desc    Get Admin Dashboard Statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getDashboardStats = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const totalStudents = await User.countDocuments({ role: 'student' });
      const totalCompanies = await User.countDocuments({ role: 'company' });
      const totalJobs = await Job.countDocuments();
      const activeJobs = await Job.countDocuments({ status: 'Active' });
      const totalApplications = await Application.countDocuments();
      const shortlistedCount = await Application.countDocuments({ status: 'Shortlisted' });
      const selectedCount = await Application.countDocuments({ status: 'Selected' });
      const underReviewCount = await Application.countDocuments({ status: 'Under Review' });
      const rejectedCount = await Application.countDocuments({ status: 'Rejected' });

      const placementRate = totalStudents > 0 ? ((selectedCount / totalStudents) * 100).toFixed(1) : 0;
      const jobs = await Job.find({ status: 'Active' });
      let highestLPA = 0;
      let avgLPA = 0;
      if (jobs.length > 0) {
        highestLPA = Math.max(...jobs.map((j) => j.packageLPA || 0));
        avgLPA = (jobs.reduce((acc, curr) => acc + (curr.packageLPA || 0), 0) / jobs.length).toFixed(2);
      }

      const statusDistribution = [
        { name: 'Applied', count: await Application.countDocuments({ status: 'Applied' }), color: '#0ea5e9' },
        { name: 'Under Review', count: underReviewCount, color: '#f59e0b' },
        { name: 'Shortlisted', count: shortlistedCount, color: '#8b5cf6' },
        { name: 'Selected', count: selectedCount, color: '#10b981' },
        { name: 'Rejected', count: rejectedCount, color: '#ef4444' },
      ];

      const branches = [
        'Computer Science (CSE)',
        'Information Technology (IT)',
        'Electronics & Comm (ECE)',
        'Electrical (EEE)',
        'Mechanical (MECH)',
        'Civil (CIVIL)',
      ];

      const branchStats = await Promise.all(
        branches.map(async (b) => {
          const studentProfiles = await StudentProfile.find({ branch: b }).select('_id user');
          const studentUserIds = studentProfiles.map((p) => p.user);
          const placed = await Application.countDocuments({
            student: { $in: studentUserIds },
            status: 'Selected',
          });
          return {
            branch: b.replace(/\s*\(.*\)/, ''),
            fullName: b,
            totalStudents: studentProfiles.length,
            placedStudents: placed,
          };
        })
      );

      const recentApplications = await Application.find()
        .populate('student', 'name email avatar')
        .populate('studentProfile', 'rollNumber branch cgpa')
        .populate({
          path: 'job',
          select: 'title packageLPA',
          populate: { path: 'companyProfile', select: 'companyName' },
        })
        .sort({ appliedAt: -1 })
        .limit(6);

      return res.status(200).json({
        success: true,
        stats: {
          totalStudents,
          totalCompanies,
          totalJobs,
          activeJobs,
          totalApplications,
          shortlistedCount,
          selectedCount,
          placementRate,
          highestLPA,
          avgLPA,
          statusDistribution,
          branchStats,
          recentApplications,
        },
      });
    } else {
      // In-Memory stats
      const totalStudents = memoryStore.users.filter((u) => u.role === 'student').length;
      const totalCompanies = memoryStore.users.filter((u) => u.role === 'company').length;
      const totalJobs = memoryStore.jobs.length;
      const activeJobs = memoryStore.jobs.filter((j) => j.status === 'Active').length;
      const totalApplications = memoryStore.applications.length;
      const shortlistedCount = memoryStore.applications.filter((a) => a.status === 'Shortlisted').length;
      const selectedCount = memoryStore.applications.filter((a) => a.status === 'Selected').length;
      const underReviewCount = memoryStore.applications.filter((a) => a.status === 'Under Review').length;
      const rejectedCount = memoryStore.applications.filter((a) => a.status === 'Rejected').length;

      const placementRate = totalStudents > 0 ? ((selectedCount / totalStudents) * 100).toFixed(1) : 0;
      const activeJ = memoryStore.jobs.filter((j) => j.status === 'Active');
      let highestLPA = 0;
      let avgLPA = 0;
      if (activeJ.length > 0) {
        highestLPA = Math.max(...activeJ.map((j) => j.packageLPA || 0));
        avgLPA = (activeJ.reduce((acc, curr) => acc + (curr.packageLPA || 0), 0) / activeJ.length).toFixed(2);
      }

      const statusDistribution = [
        { name: 'Applied', count: memoryStore.applications.filter((a) => a.status === 'Applied').length, color: '#0ea5e9' },
        { name: 'Under Review', count: underReviewCount, color: '#f59e0b' },
        { name: 'Shortlisted', count: shortlistedCount, color: '#8b5cf6' },
        { name: 'Selected', count: selectedCount, color: '#10b981' },
        { name: 'Rejected', count: rejectedCount, color: '#ef4444' },
      ];

      const branches = [
        'Computer Science (CSE)',
        'Information Technology (IT)',
        'Electronics & Comm (ECE)',
        'Electrical (EEE)',
        'Mechanical (MECH)',
        'Civil (CIVIL)',
      ];

      const branchStats = branches.map((b) => {
        const studentProfiles = memoryStore.studentProfiles.filter((p) => p.branch === b);
        const studentUserIds = studentProfiles.map((p) => p.user.toString());
        const placed = memoryStore.applications.filter(
          (a) => studentUserIds.includes(a.student.toString()) && a.status === 'Selected'
        ).length;

        return {
          branch: b.replace(/\s*\(.*\)/, ''),
          fullName: b,
          totalStudents: studentProfiles.length,
          placedStudents: placed,
        };
      });

      const recentApplications = memoryStore.applications.slice(0, 6).map((app) => {
        const stu = memoryStore.users.find((u) => u._id.toString() === app.student.toString());
        const prof = memoryStore.studentProfiles.find(
          (p) => p._id.toString() === (app.studentProfile ? app.studentProfile.toString() : '')
        );
        const job = memoryStore.jobs.find((j) => j._id.toString() === app.job.toString());

        return {
          ...app,
          student: stu ? { name: stu.name, email: stu.email } : null,
          studentProfile: prof ? { rollNumber: prof.rollNumber, branch: prof.branch, cgpa: prof.cgpa } : null,
          job: job ? { title: job.title, packageLPA: job.packageLPA } : null,
        };
      });

      return res.status(200).json({
        success: true,
        stats: {
          totalStudents,
          totalCompanies,
          totalJobs,
          activeJobs,
          totalApplications,
          shortlistedCount,
          selectedCount,
          placementRate,
          highestLPA,
          avgLPA,
          statusDistribution,
          branchStats,
          recentApplications,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching stats.' });
  }
};

// @desc    Get all students list with academic details
// @route   GET /api/admin/students
// @access  Private (Admin)
exports.getStudentsList = async (req, res) => {
  try {
    const { search, branch } = req.query;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      let userFilter = { role: 'student' };
      if (search) {
        userFilter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }

      const students = await User.find(userFilter).select('-password').sort({ createdAt: -1 });
      const enrichedStudents = await Promise.all(
        students.map(async (student) => {
          const profile = await StudentProfile.findOne({ user: student._id });
          const applicationsCount = await Application.countDocuments({ student: student._id });
          const selectionsCount = await Application.countDocuments({ student: student._id, status: 'Selected' });
          return {
            ...student.toObject(),
            profile,
            applicationsCount,
            isPlaced: selectionsCount > 0,
          };
        })
      );

      let filtered = enrichedStudents;
      if (branch && branch !== 'All') {
        filtered = filtered.filter((s) => s.profile?.branch === branch);
      }
      return res.status(200).json({ success: true, count: filtered.length, students: filtered });
    } else {
      let stuUsers = memoryStore.users.filter((u) => u.role === 'student');

      if (search) {
        const s = search.toLowerCase();
        stuUsers = stuUsers.filter((u) => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s));
      }

      const enriched = stuUsers.map((student) => {
        const profile = memoryStore.studentProfiles.find((p) => p.user.toString() === student._id.toString());
        const appsCount = memoryStore.applications.filter((a) => a.student.toString() === student._id.toString()).length;
        const placed = memoryStore.applications.some(
          (a) => a.student.toString() === student._id.toString() && a.status === 'Selected'
        );

        return {
          ...student,
          profile: profile || null,
          applicationsCount: appsCount,
          isPlaced: placed,
        };
      });

      let filtered = enriched;
      if (branch && branch !== 'All') {
        filtered = filtered.filter((s) => s.profile?.branch === branch);
      }

      return res.status(200).json({ success: true, count: filtered.length, students: filtered });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching students.' });
  }
};

// @desc    Get all registered companies
// @route   GET /api/admin/companies
// @access  Private (Admin)
exports.getCompaniesList = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const companies = await User.find({ role: 'company' }).select('-password').sort({ createdAt: -1 });
      const enriched = await Promise.all(
        companies.map(async (comp) => {
          const profile = await CompanyProfile.findOne({ user: comp._id });
          const jobsCount = await Job.countDocuments({ company: comp._id });
          const applicationsCount = await Application.countDocuments({
            job: { $in: await Job.find({ company: comp._id }).select('_id') },
          });
          return { ...comp.toObject(), profile, jobsCount, applicationsCount };
        })
      );
      return res.status(200).json({ success: true, count: enriched.length, companies: enriched });
    } else {
      const compUsers = memoryStore.users.filter((u) => u.role === 'company');
      const enriched = compUsers.map((comp) => {
        const profile = memoryStore.companyProfiles.find((p) => p.user.toString() === comp._id.toString());
        const compJobIds = memoryStore.jobs
          .filter((j) => j.company.toString() === comp._id.toString())
          .map((j) => j._id.toString());
        const appsCount = memoryStore.applications.filter((a) => compJobIds.includes(a.job.toString())).length;

        return {
          ...comp,
          profile: profile || null,
          jobsCount: compJobIds.length,
          applicationsCount: appsCount,
        };
      });
      return res.status(200).json({ success: true, count: enriched.length, companies: enriched });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching companies.' });
  }
};

// @desc    Toggle student/company active status
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private (Admin)
exports.toggleUserStatus = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
      if (user.role === 'admin') return res.status(400).json({ success: false, message: 'Cannot deactivate admin.' });

      user.isApproved = !user.isApproved;
      await user.save();
      return res.status(200).json({
        success: true,
        message: `User '${user.name}' has been ${user.isApproved ? 'activated' : 'deactivated'}.`,
        isApproved: user.isApproved,
      });
    } else {
      const user = memoryStore.users.find((u) => u._id.toString() === req.params.id.toString());
      if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
      if (user.role === 'admin') return res.status(400).json({ success: false, message: 'Cannot deactivate admin.' });

      user.isApproved = !user.isApproved;
      return res.status(200).json({
        success: true,
        message: `User '${user.name}' has been ${user.isApproved ? 'activated' : 'deactivated'}.`,
        isApproved: user.isApproved,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error toggling user status.' });
  }
};

// @desc    Get all notifications / announcements
// @route   GET /api/admin/notifications
// @access  Public / Private
exports.getNotifications = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const notifications = await Notification.find({ isActive: true }).sort({ createdAt: -1 }).limit(15);
      return res.status(200).json({ success: true, notifications });
    } else {
      const notifications = memoryStore.notifications.filter((n) => n.isActive !== false);
      return res.status(200).json({ success: true, notifications });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching notifications.' });
  }
};

// @desc    Create new notification / announcement
// @route   POST /api/admin/notifications
// @access  Private (Admin)
exports.createNotification = async (req, res) => {
  try {
    const { title, message, type, targetRole } = req.body;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const notification = await Notification.create({
        title,
        message,
        type: type || 'info',
        targetRole: targetRole || 'all',
        senderName: 'Placement Cell - Team 4',
      });
      return res.status(201).json({ success: true, message: 'Notice broadcasted successfully!', notification });
    } else {
      const notification = {
        _id: 'notif_' + Date.now(),
        title,
        message,
        type: type || 'info',
        targetRole: targetRole || 'all',
        senderName: 'Placement Cell - Team 4',
        isActive: true,
        createdAt: new Date(),
      };
      memoryStore.notifications.unshift(notification);
      return res.status(201).json({ success: true, message: 'Notice broadcasted successfully!', notification });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error creating notification.' });
  }
};

// @desc    Delete notification
// @route   DELETE /api/admin/notifications/:id
// @access  Private (Admin)
exports.deleteNotification = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      await Notification.findByIdAndDelete(req.params.id);
      return res.status(200).json({ success: true, message: 'Notice removed.' });
    } else {
      const index = memoryStore.notifications.findIndex((n) => n._id.toString() === req.params.id.toString());
      if (index !== -1) memoryStore.notifications.splice(index, 1);
      return res.status(200).json({ success: true, message: 'Notice removed.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error deleting notice.' });
  }
};
