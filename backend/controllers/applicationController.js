const mongoose = require('mongoose');
const Application = require('../models/Application');
const Job = require('../models/Job');
const StudentProfile = require('../models/StudentProfile');
const memoryStore = require('../config/inMemoryStore');

// @desc    Apply for a job
// @route   POST /api/applications/apply/:jobId
// @access  Private (Student)
exports.applyForJob = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const job = await Job.findById(req.params.jobId);
      if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });

      const profile = await StudentProfile.findOne({ user: req.user._id });
      if (!profile) {
        return res.status(400).json({ success: false, message: 'Please complete your profile before applying.' });
      }

      // CGPA Check
      if (profile.cgpa < job.eligibility.minCgpa) {
        return res.status(400).json({
          success: false,
          message: `Eligibility failed: Minimum required CGPA is ${job.eligibility.minCgpa}, your CGPA is ${profile.cgpa}.`,
        });
      }

      // Allowed branches check
      if (
        job.eligibility.allowedBranches?.length &&
        !job.eligibility.allowedBranches.includes(profile.branch)
      ) {
        return res.status(400).json({
          success: false,
          message: `Eligibility failed: Branch ${profile.branch} is not eligible.`,
        });
      }

      const existing = await Application.findOne({ job: job._id, student: req.user._id });
      if (existing) {
        return res.status(400).json({ success: false, message: 'You have already applied for this job drive.' });
      }

      const application = await Application.create({
        job: job._id,
        student: req.user._id,
        studentProfile: profile._id,
        status: 'Applied',
        remarks: 'Application submitted and queued for review.',
        resumeSnapshot: { url: profile.resumeUrl || '', fileName: profile.resumeOriginalName || 'Resume.pdf' },
      });

      return res.status(201).json({ success: true, message: 'Application submitted successfully!', application });
    } else {
      const job = memoryStore.jobs.find((j) => j._id.toString() === req.params.jobId.toString());
      if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });

      const profile = memoryStore.studentProfiles.find((p) => p.user.toString() === req.user._id.toString());
      if (!profile) {
        return res.status(400).json({ success: false, message: 'Please complete your profile before applying.' });
      }

      // Check eligibility
      if (profile.cgpa < job.eligibility.minCgpa) {
        return res.status(400).json({
          success: false,
          message: `Eligibility failed: Minimum required CGPA is ${job.eligibility.minCgpa}, your CGPA is ${profile.cgpa}.`,
        });
      }

      const existing = memoryStore.applications.find(
        (a) => a.job.toString() === job._id.toString() && a.student.toString() === req.user._id.toString()
      );
      if (existing) {
        return res.status(400).json({ success: false, message: 'You have already applied for this job drive.' });
      }

      const newApp = {
        _id: 'app_' + Date.now(),
        job: job._id,
        student: req.user._id,
        studentProfile: profile._id,
        status: 'Applied',
        remarks: 'Application submitted and queued for review.',
        appliedAt: new Date(),
        resumeSnapshot: { url: profile.resumeUrl || '', fileName: profile.resumeOriginalName || 'Resume.pdf' },
      };
      memoryStore.applications.unshift(newApp);

      return res.status(201).json({ success: true, message: 'Application submitted successfully!', application: newApp });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error submitting application.' });
  }
};

// @desc    Get all applications submitted by logged-in student
// @route   GET /api/applications/my-applications
// @access  Private (Student)
exports.getMyApplications = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const applications = await Application.find({ student: req.user._id })
        .populate({
          path: 'job',
          select: 'title role packageLPA stipend jobType location deadline status',
          populate: { path: 'companyProfile', select: 'companyName location website logoUrl' },
        })
        .sort({ appliedAt: -1 });

      return res.status(200).json({ success: true, count: applications.length, applications });
    } else {
      const apps = memoryStore.applications.filter((a) => a.student.toString() === req.user._id.toString());
      const populated = apps.map((app) => {
        const job = memoryStore.jobs.find((j) => j._id.toString() === app.job.toString());
        const compProf = job
          ? memoryStore.companyProfiles.find((p) => p._id.toString() === (job.companyProfile ? job.companyProfile.toString() : ''))
          : null;

        return {
          ...app,
          job: job
            ? {
                _id: job._id,
                title: job.title,
                role: job.role,
                packageLPA: job.packageLPA,
                location: job.location,
                deadline: job.deadline,
                companyProfile: compProf || { companyName: 'Corporate Recruiter' },
              }
            : null,
        };
      });

      return res.status(200).json({ success: true, count: populated.length, applications: populated });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching your applications.' });
  }
};

// @desc    Get all applicants for a specific job drive (Company or Admin)
// @route   GET /api/applications/job/:jobId
// @access  Private (Company or Admin)
exports.getJobApplicants = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const job = await Job.findById(req.params.jobId);
      if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });

      const applications = await Application.find({ job: job._id })
        .populate('student', 'name email avatar')
        .populate('studentProfile')
        .sort({ appliedAt: -1 });

      return res.status(200).json({ success: true, count: applications.length, jobTitle: job.title, applications });
    } else {
      const job = memoryStore.jobs.find((j) => j._id.toString() === req.params.jobId.toString());
      if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });

      const apps = memoryStore.applications.filter((a) => a.job.toString() === job._id.toString());
      const populated = apps.map((app) => {
        const stu = memoryStore.users.find((u) => u._id.toString() === app.student.toString());
        const prof = memoryStore.studentProfiles.find(
          (p) => p._id.toString() === (app.studentProfile ? app.studentProfile.toString() : '')
        );

        return {
          ...app,
          student: stu ? { _id: stu._id, name: stu.name, email: stu.email } : null,
          studentProfile: prof || null,
        };
      });

      return res.status(200).json({ success: true, count: populated.length, jobTitle: job.title, applications: populated });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching applicants.' });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Company or Admin)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, remarks, interviewDate } = req.body;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const application = await Application.findById(req.params.id);
      if (!application) return res.status(404).json({ success: false, message: 'Application not found.' });

      application.status = status;
      if (remarks) application.remarks = remarks;
      if (interviewDate !== undefined) application.interviewDate = interviewDate;
      await application.save();

      return res.status(200).json({ success: true, message: `Applicant status updated to '${status}'.`, application });
    } else {
      const app = memoryStore.applications.find((a) => a._id.toString() === req.params.id.toString());
      if (!app) return res.status(404).json({ success: false, message: 'Application not found.' });

      app.status = status;
      if (remarks) app.remarks = remarks;
      if (interviewDate !== undefined) app.interviewDate = interviewDate;

      return res.status(200).json({ success: true, message: `Applicant status updated to '${status}'.`, application: app });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error updating status.' });
  }
};

// @desc    Get all applications (Admin only)
// @route   GET /api/applications/all
// @access  Private (Admin)
exports.getAllApplications = async (req, res) => {
  try {
    const { status } = req.query;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      let filter = {};
      if (status && status !== 'All') filter.status = status;

      const applications = await Application.find(filter)
        .populate('student', 'name email avatar')
        .populate('studentProfile')
        .populate({
          path: 'job',
          select: 'title role packageLPA location',
          populate: { path: 'companyProfile', select: 'companyName' },
        })
        .sort({ appliedAt: -1 });

      return res.status(200).json({ success: true, count: applications.length, applications });
    } else {
      let apps = [...memoryStore.applications];
      if (status && status !== 'All') {
        apps = apps.filter((a) => a.status === status);
      }

      const populated = apps.map((app) => {
        const stu = memoryStore.users.find((u) => u._id.toString() === app.student.toString());
        const prof = memoryStore.studentProfiles.find(
          (p) => p._id.toString() === (app.studentProfile ? app.studentProfile.toString() : '')
        );
        const job = memoryStore.jobs.find((j) => j._id.toString() === app.job.toString());
        const compProf = job
          ? memoryStore.companyProfiles.find((p) => p._id.toString() === (job.companyProfile ? job.companyProfile.toString() : ''))
          : null;

        return {
          ...app,
          student: stu ? { _id: stu._id, name: stu.name, email: stu.email } : null,
          studentProfile: prof || null,
          job: job
            ? {
                _id: job._id,
                title: job.title,
                packageLPA: job.packageLPA,
                companyProfile: compProf || { companyName: 'Corporate Recruiter' },
              }
            : null,
        };
      });

      return res.status(200).json({ success: true, count: populated.length, applications: populated });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching applications.' });
  }
};
