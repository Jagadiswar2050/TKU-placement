const mongoose = require('mongoose');
const StudentProfile = require('../models/StudentProfile');
const Job = require('../models/Job');
const Application = require('../models/Application');
const memoryStore = require('../config/inMemoryStore');

// @desc    Get current student's profile
// @route   GET /api/students/profile
// @access  Private (Student)
exports.getProfile = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      let profile = await StudentProfile.findOne({ user: req.user._id }).populate('user', 'name email avatar role');
      if (!profile) {
        profile = await StudentProfile.create({
          user: req.user._id,
          rollNumber: `STU-${Date.now().toString().slice(-4)}`,
          branch: 'Computer Science (CSE)',
          cgpa: 0,
        });
        profile = await profile.populate('user', 'name email avatar role');
      }
      return res.status(200).json({ success: true, profile });
    } else {
      let profile = memoryStore.studentProfiles.find((p) => p.user.toString() === req.user._id.toString());
      if (!profile) {
        profile = {
          _id: 'prof_' + req.user._id,
          user: req.user._id,
          rollNumber: `STU-${Date.now().toString().slice(-4)}`,
          branch: 'Computer Science (CSE)',
          cgpa: 0,
          passingYear: 2026,
          activeBacklogs: 0,
          skills: [],
        };
        memoryStore.studentProfiles.push(profile);
      }
      return res.status(200).json({ success: true, profile: { ...profile, user: req.user } });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching student profile.' });
  }
};

// @desc    Update current student profile
// @route   PUT /api/students/profile
// @access  Private (Student)
exports.updateProfile = async (req, res) => {
  try {
    const {
      rollNumber,
      phone,
      branch,
      cgpa,
      tenthPercentage,
      twelfthPercentage,
      passingYear,
      activeBacklogs,
      skills,
      resumeUrl,
      githubUrl,
      linkedinUrl,
      bio,
    } = req.body;

    const formattedSkills = Array.isArray(skills)
      ? skills
      : typeof skills === 'string'
      ? skills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      let profile = await StudentProfile.findOne({ user: req.user._id });
      const updateFields = {
        rollNumber: rollNumber || (profile ? profile.rollNumber : undefined),
        phone: phone !== undefined ? phone : (profile ? profile.phone : ''),
        branch: branch || (profile ? profile.branch : 'Computer Science (CSE)'),
        cgpa: cgpa !== undefined ? parseFloat(cgpa) : (profile ? profile.cgpa : 0),
        tenthPercentage: tenthPercentage !== undefined ? parseFloat(tenthPercentage) : (profile ? profile.tenthPercentage : 0),
        twelfthPercentage: twelfthPercentage !== undefined ? parseFloat(twelfthPercentage) : (profile ? profile.twelfthPercentage : 0),
        passingYear: passingYear !== undefined ? parseInt(passingYear) : (profile ? profile.passingYear : 2026),
        activeBacklogs: activeBacklogs !== undefined ? parseInt(activeBacklogs) : (profile ? profile.activeBacklogs : 0),
        skills: formattedSkills.length ? formattedSkills : (profile ? profile.skills : []),
        resumeUrl: resumeUrl !== undefined ? resumeUrl : (profile ? profile.resumeUrl : ''),
        githubUrl: githubUrl !== undefined ? githubUrl : (profile ? profile.githubUrl : ''),
        linkedinUrl: linkedinUrl !== undefined ? linkedinUrl : (profile ? profile.linkedinUrl : ''),
        bio: bio !== undefined ? bio : (profile ? profile.bio : ''),
      };

      profile = await StudentProfile.findOneAndUpdate(
        { user: req.user._id },
        { $set: updateFields },
        { new: true, upsert: true, runValidators: true }
      ).populate('user', 'name email avatar role');

      return res.status(200).json({ success: true, message: 'Student profile updated successfully!', profile });
    } else {
      let profile = memoryStore.studentProfiles.find((p) => p.user.toString() === req.user._id.toString());
      if (profile) {
        if (rollNumber) profile.rollNumber = rollNumber;
        if (phone !== undefined) profile.phone = phone;
        if (branch) profile.branch = branch;
        if (cgpa !== undefined) profile.cgpa = parseFloat(cgpa);
        if (tenthPercentage !== undefined) profile.tenthPercentage = parseFloat(tenthPercentage);
        if (twelfthPercentage !== undefined) profile.twelfthPercentage = parseFloat(twelfthPercentage);
        if (passingYear !== undefined) profile.passingYear = parseInt(passingYear);
        if (activeBacklogs !== undefined) profile.activeBacklogs = parseInt(activeBacklogs);
        if (formattedSkills.length) profile.skills = formattedSkills;
        if (resumeUrl !== undefined) profile.resumeUrl = resumeUrl;
        if (githubUrl !== undefined) profile.githubUrl = githubUrl;
        if (linkedinUrl !== undefined) profile.linkedinUrl = linkedinUrl;
        if (bio !== undefined) profile.bio = bio;
      } else {
        profile = {
          _id: 'prof_' + req.user._id,
          user: req.user._id,
          rollNumber: rollNumber || `STU-${Date.now().toString().slice(-4)}`,
          phone: phone || '',
          branch: branch || 'Computer Science (CSE)',
          cgpa: cgpa !== undefined ? parseFloat(cgpa) : 0,
          tenthPercentage: tenthPercentage !== undefined ? parseFloat(tenthPercentage) : 0,
          twelfthPercentage: twelfthPercentage !== undefined ? parseFloat(twelfthPercentage) : 0,
          passingYear: passingYear !== undefined ? parseInt(passingYear) : 2026,
          activeBacklogs: activeBacklogs !== undefined ? parseInt(activeBacklogs) : 0,
          skills: formattedSkills,
          resumeUrl: resumeUrl || '',
          githubUrl: githubUrl || '',
          linkedinUrl: linkedinUrl || '',
          bio: bio || '',
        };
        memoryStore.studentProfiles.push(profile);
      }
      return res.status(200).json({ success: true, message: 'Student profile updated successfully!', profile: { ...profile, user: req.user } });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error updating student profile.' });
  }
};

// @desc    Upload student resume file
// @route   POST /api/students/upload-resume
// @access  Private (Student)
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select a resume file (PDF, DOC, DOCX).' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const originalName = req.file.originalname;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const profile = await StudentProfile.findOneAndUpdate(
        { user: req.user._id },
        { $set: { resumeUrl: fileUrl, resumeOriginalName: originalName } },
        { new: true, upsert: true }
      );
      return res.status(200).json({ success: true, message: 'Resume uploaded successfully!', resumeUrl: fileUrl, resumeOriginalName: originalName, profile });
    } else {
      let profile = memoryStore.studentProfiles.find((p) => p.user.toString() === req.user._id.toString());
      if (profile) {
        profile.resumeUrl = fileUrl;
        profile.resumeOriginalName = originalName;
      }
      return res.status(200).json({ success: true, message: 'Resume uploaded successfully!', resumeUrl: fileUrl, resumeOriginalName: originalName, profile });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error uploading resume.' });
  }
};

// @desc    Check eligibility for a specific job drive
// @route   GET /api/students/check-eligibility/:jobId
// @access  Private (Student)
exports.checkEligibility = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    let job = null;
    let profile = null;
    let existingApp = null;

    if (isDbConnected) {
      job = await Job.findById(req.params.jobId);
      profile = await StudentProfile.findOne({ user: req.user._id });
      if (job) existingApp = await Application.findOne({ job: job._id, student: req.user._id });
    } else {
      job = memoryStore.jobs.find((j) => j._id.toString() === req.params.jobId.toString());
      profile = memoryStore.studentProfiles.find((p) => p.user.toString() === req.user._id.toString());
      if (job) {
        existingApp = memoryStore.applications.find(
          (a) => a.job.toString() === job._id.toString() && a.student.toString() === req.user._id.toString()
        );
      }
    }

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job drive not found.' });
    }

    if (!profile) {
      return res.status(200).json({
        success: true,
        isEligible: false,
        reasons: ['Please complete your academic profile first to check eligibility.'],
      });
    }

    const reasons = [];
    let isEligible = true;

    // Check CGPA
    if (profile.cgpa < job.eligibility.minCgpa) {
      isEligible = false;
      reasons.push(`Minimum CGPA required is ${job.eligibility.minCgpa}, but your current CGPA is ${profile.cgpa}.`);
    }

    // Check Allowed Branches
    if (
      job.eligibility.allowedBranches &&
      job.eligibility.allowedBranches.length > 0 &&
      !job.eligibility.allowedBranches.includes(profile.branch)
    ) {
      isEligible = false;
      reasons.push(
        `Your branch (${profile.branch}) is not in the eligible branches list: ${job.eligibility.allowedBranches.join(', ')}.`
      );
    }

    // Check Backlogs
    if (profile.activeBacklogs > job.eligibility.maxBacklogs) {
      isEligible = false;
      reasons.push(`Max allowed active backlogs is ${job.eligibility.maxBacklogs}, but you have ${profile.activeBacklogs}.`);
    }

    res.status(200).json({
      success: true,
      isEligible,
      reasons: reasons.length ? reasons : ['You meet all eligibility criteria for this job drive!'],
      hasApplied: !!existingApp,
      applicationStatus: existingApp ? existingApp.status : null,
      studentStats: {
        cgpa: profile.cgpa,
        branch: profile.branch,
        backlogs: profile.activeBacklogs,
        hasResume: !!profile.resumeUrl,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error checking eligibility.' });
  }
};
