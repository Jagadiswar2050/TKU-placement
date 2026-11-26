const mongoose = require('mongoose');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const CompanyProfile = require('../models/CompanyProfile');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const memoryStore = require('../config/inMemoryStore');

// Generate JWT Token helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'placement_portal_secret_key_team4_2026', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user (Student or Company)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, ...extraData } = req.body;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'A user with this email address already exists.',
        });
      }

      const validRole = role === 'company' ? 'company' : 'student';
      const user = await User.create({
        name,
        email,
        password,
        role: validRole,
      });

      if (validRole === 'student') {
        await StudentProfile.create({
          user: user._id,
          rollNumber: extraData.rollNumber || `STU-${Date.now().toString().slice(-4)}`,
          branch: extraData.branch || 'Computer Science (CSE)',
          cgpa: extraData.cgpa ? parseFloat(extraData.cgpa) : 0,
          phone: extraData.phone || '',
          passingYear: extraData.passingYear ? parseInt(extraData.passingYear) : 2026,
          skills: extraData.skills ? (Array.isArray(extraData.skills) ? extraData.skills : extraData.skills.split(',').map((s) => s.trim())) : [],
        });
      } else if (validRole === 'company') {
        await CompanyProfile.create({
          user: user._id,
          companyName: extraData.companyName || name,
          website: extraData.website || '',
          industry: extraData.industry || 'Technology',
          location: extraData.location || 'Bengaluru / Hybrid',
          description: extraData.description || '',
          contactPhone: extraData.phone || '',
        });
      }

      const token = generateToken(user._id);
      return res.status(201).json({
        success: true,
        message: 'Registration successful! Welcome to the Placement Portal.',
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    } else {
      // In-Memory Fallback
      const existing = memoryStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ success: false, message: 'A user with this email address already exists.' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const validRole = role === 'company' ? 'company' : 'student';
      const newUserId = '66' + Date.now().toString(16).padStart(22, '0').slice(-22);

      const newUser = {
        _id: newUserId,
        name,
        email,
        password: hashedPassword,
        role: validRole,
        isApproved: true,
        createdAt: new Date(),
      };
      memoryStore.users.push(newUser);

      if (validRole === 'student') {
        memoryStore.studentProfiles.push({
          _id: 'prof_' + newUserId,
          user: newUserId,
          rollNumber: extraData.rollNumber || `STU-${Date.now().toString().slice(-4)}`,
          branch: extraData.branch || 'Computer Science (CSE)',
          cgpa: extraData.cgpa ? parseFloat(extraData.cgpa) : 0,
          phone: extraData.phone || '',
          passingYear: extraData.passingYear ? parseInt(extraData.passingYear) : 2026,
          skills: extraData.skills ? (Array.isArray(extraData.skills) ? extraData.skills : extraData.skills.split(',').map((s) => s.trim())) : [],
        });
      } else if (validRole === 'company') {
        memoryStore.companyProfiles.push({
          _id: 'cprof_' + newUserId,
          user: newUserId,
          companyName: extraData.companyName || name,
          website: extraData.website || '',
          industry: extraData.industry || 'Technology',
          location: extraData.location || 'Bengaluru / Hybrid',
          description: extraData.description || '',
          contactPhone: extraData.phone || '',
          isVerified: true,
        });
      }

      const token = generateToken(newUser._id);
      return res.status(201).json({
        success: true,
        message: 'Registration successful! Welcome to the Placement Portal.',
        token,
        user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
      });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during registration.' });
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials. Password incorrect.' });
      }

      if (!user.isApproved) {
        return res.status(403).json({ success: false, message: 'Your account is deactivated. Contact Placement Cell.' });
      }

      const token = generateToken(user._id);
      let profile = null;
      if (user.role === 'student') {
        profile = await StudentProfile.findOne({ user: user._id });
      } else if (user.role === 'company') {
        profile = await CompanyProfile.findOne({ user: user._id });
      }

      return res.status(200).json({
        success: true,
        message: 'Login successful.',
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
        profile,
      });
    } else {
      // In-Memory Login
      const user = memoryStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials. Password incorrect.' });
      }

      if (!user.isApproved) {
        return res.status(403).json({ success: false, message: 'Your account is deactivated. Contact Placement Cell.' });
      }

      const token = generateToken(user._id);
      let profile = null;
      if (user.role === 'student') {
        profile = memoryStore.studentProfiles.find((p) => p.user.toString() === user._id.toString());
      } else if (user.role === 'company') {
        profile = memoryStore.companyProfiles.find((p) => p.user.toString() === user._id.toString());
      }

      return res.status(200).json({
        success: true,
        message: 'Login successful.',
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
        profile,
      });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during login.' });
  }
};

// @desc    Get current logged in user & profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    if (isDbConnected) {
      const user = await User.findById(req.user.id);
      let profile = null;
      if (user.role === 'student') {
        profile = await StudentProfile.findOne({ user: user._id });
      } else if (user.role === 'company') {
        profile = await CompanyProfile.findOne({ user: user._id });
      }
      return res.status(200).json({ success: true, user, profile });
    } else {
      const user = memoryStore.users.find((u) => u._id.toString() === req.user._id.toString());
      let profile = null;
      if (user.role === 'student') {
        profile = memoryStore.studentProfiles.find((p) => p.user.toString() === user._id.toString());
      } else if (user.role === 'company') {
        profile = memoryStore.companyProfiles.find((p) => p.user.toString() === user._id.toString());
      }
      return res.status(200).json({ success: true, user, profile });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error fetching user details.' });
  }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const user = await User.findById(req.user.id).select('+password');
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password does not match.' });
      }
      user.password = newPassword;
      await user.save();
      return res.status(200).json({ success: true, message: 'Password updated successfully.' });
    } else {
      const user = memoryStore.users.find((u) => u._id.toString() === req.user._id.toString());
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password does not match.' });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      return res.status(200).json({ success: true, message: 'Password updated successfully.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error updating password.' });
  }
};
