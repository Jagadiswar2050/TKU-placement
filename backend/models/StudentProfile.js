const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    rollNumber: {
      type: String,
      required: [true, 'Roll Number / Student ID is required'],
      trim: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    branch: {
      type: String,
      required: [true, 'Branch / Department is required'],
      enum: ['Computer Science (CSE)', 'Information Technology (IT)', 'Electronics & Comm (ECE)', 'Electrical (EEE)', 'Mechanical (MECH)', 'Civil (CIVIL)', 'Other'],
      default: 'Computer Science (CSE)',
    },
    cgpa: {
      type: Number,
      required: [true, 'Current CGPA is required'],
      min: [0, 'CGPA cannot be negative'],
      max: [10, 'CGPA cannot exceed 10'],
      default: 0,
    },
    tenthPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    twelfthPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    passingYear: {
      type: Number,
      default: 2026,
    },
    activeBacklogs: {
      type: Number,
      default: 0,
      min: [0, 'Backlogs cannot be negative'],
    },
    skills: {
      type: [String],
      default: [],
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    resumeOriginalName: {
      type: String,
      default: '',
    },
    githubUrl: {
      type: String,
      default: '',
    },
    linkedinUrl: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
