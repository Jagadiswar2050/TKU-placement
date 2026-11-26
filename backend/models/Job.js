const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CompanyProfile',
    },
    title: {
      type: String,
      required: [true, 'Job Title is required'],
      trim: true,
    },
    role: {
      type: String,
      default: 'Software Development',
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job Description is required'],
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    skillsRequired: {
      type: [String],
      default: [],
    },
    packageLPA: {
      type: Number,
      required: [true, 'Package in LPA is required'],
      default: 6.0,
    },
    stipend: {
      type: String,
      default: '₹25,000 / month',
    },
    jobType: {
      type: String,
      enum: ['Full-Time', 'Internship', 'Internship + Full-Time'],
      default: 'Full-Time',
    },
    location: {
      type: String,
      default: 'Pan India / Remote',
    },
    openingsCount: {
      type: Number,
      default: 5,
    },
    eligibility: {
      minCgpa: {
        type: Number,
        default: 6.5,
      },
      allowedBranches: {
        type: [String],
        default: ['Computer Science (CSE)', 'Information Technology (IT)', 'Electronics & Comm (ECE)'],
      },
      maxBacklogs: {
        type: Number,
        default: 0,
      },
      minTenthMarks: {
        type: Number,
        default: 60,
      },
      minTwelfthMarks: {
        type: Number,
        default: 60,
      },
      eligiblePassingYears: {
        type: [Number],
        default: [2026, 2027],
      },
    },
    deadline: {
      type: Date,
      required: [true, 'Application Deadline is required'],
    },
    status: {
      type: String,
      enum: ['Active', 'Closed', 'Draft'],
      default: 'Active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
