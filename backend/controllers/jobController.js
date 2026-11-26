const mongoose = require('mongoose');
const Job = require('../models/Job');
const CompanyProfile = require('../models/CompanyProfile');
const Application = require('../models/Application');
const memoryStore = require('../config/inMemoryStore');

// @desc    Get all active jobs with searching and filtering
// @route   GET /api/jobs
// @access  Public
exports.getAllJobs = async (req, res) => {
  try {
    const { keyword, branch, minCgpa, jobType, role, status } = req.query;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      let query = {};
      if (status) query.status = status;
      else query.status = 'Active';

      if (keyword) {
        query.$or = [
          { title: { $regex: keyword, $options: 'i' } },
          { role: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
          { location: { $regex: keyword, $options: 'i' } },
          { skillsRequired: { $in: [new RegExp(keyword, 'i')] } },
        ];
      }
      if (jobType && jobType !== 'All') query.jobType = jobType;
      if (role && role !== 'All') query.role = { $regex: role, $options: 'i' };
      if (branch && branch !== 'All') query['eligibility.allowedBranches'] = { $in: [branch] };
      if (minCgpa) query['eligibility.minCgpa'] = { $lte: parseFloat(minCgpa) };

      const jobs = await Job.find(query)
        .populate('company', 'name email avatar')
        .populate('companyProfile', 'companyName website industry location logoUrl')
        .sort({ createdAt: -1 });

      return res.status(200).json({ success: true, count: jobs.length, jobs });
    } else {
      let jobs = [...memoryStore.jobs];

      if (status) {
        jobs = jobs.filter((j) => j.status === status);
      } else {
        jobs = jobs.filter((j) => j.status === 'Active');
      }

      if (keyword) {
        const k = keyword.toLowerCase();
        jobs = jobs.filter(
          (j) =>
            j.title.toLowerCase().includes(k) ||
            j.role.toLowerCase().includes(k) ||
            j.description.toLowerCase().includes(k) ||
            j.location.toLowerCase().includes(k) ||
            (j.skillsRequired && j.skillsRequired.some((s) => s.toLowerCase().includes(k)))
        );
      }

      if (jobType && jobType !== 'All') {
        jobs = jobs.filter((j) => j.jobType === jobType);
      }

      if (branch && branch !== 'All') {
        jobs = jobs.filter(
          (j) => j.eligibility?.allowedBranches && j.eligibility.allowedBranches.includes(branch)
        );
      }

      if (minCgpa) {
        jobs = jobs.filter((j) => (j.eligibility?.minCgpa || 0) <= parseFloat(minCgpa));
      }

      // Populate company & profile
      const populated = jobs.map((job) => {
        const comp = memoryStore.users.find((u) => u._id.toString() === job.company.toString());
        const prof = memoryStore.companyProfiles.find(
          (p) => p._id.toString() === (job.companyProfile ? job.companyProfile.toString() : '')
        );
        return {
          ...job,
          company: comp ? { _id: comp._id, name: comp.name, email: comp.email } : null,
          companyProfile: prof || null,
        };
      });

      return res.status(200).json({ success: true, count: populated.length, jobs: populated });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error retrieving job drives.' });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
exports.getJobById = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const job = await Job.findById(req.params.id)
        .populate('company', 'name email avatar')
        .populate('companyProfile', 'companyName website industry location description logoUrl');

      if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });
      const applicantsCount = await Application.countDocuments({ job: job._id });
      return res.status(200).json({ success: true, job, applicantsCount });
    } else {
      const job = memoryStore.jobs.find((j) => j._id.toString() === req.params.id.toString());
      if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });

      const comp = memoryStore.users.find((u) => u._id.toString() === job.company.toString());
      const prof = memoryStore.companyProfiles.find(
        (p) => p._id.toString() === (job.companyProfile ? job.companyProfile.toString() : '')
      );
      const applicantsCount = memoryStore.applications.filter((a) => a.job.toString() === job._id.toString()).length;

      return res.status(200).json({
        success: true,
        job: {
          ...job,
          company: comp ? { _id: comp._id, name: comp.name, email: comp.email } : null,
          companyProfile: prof || null,
        },
        applicantsCount,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error retrieving job details.' });
  }
};

// @desc    Create new job drive (Company only)
// @route   POST /api/jobs
// @access  Private (Company)
exports.createJob = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    const {
      title,
      role,
      description,
      responsibilities,
      skillsRequired,
      packageLPA,
      stipend,
      jobType,
      location,
      openingsCount,
      eligibility,
      deadline,
      status,
    } = req.body;

    const formattedSkills = Array.isArray(skillsRequired) ? skillsRequired : [];
    const formattedResponsibilities = Array.isArray(responsibilities) ? responsibilities : [];

    if (isDbConnected) {
      const companyProfile = await CompanyProfile.findOne({ user: req.user._id });
      const job = await Job.create({
        company: req.user._id,
        companyProfile: companyProfile ? companyProfile._id : null,
        title,
        role: role || 'Software Development',
        description,
        responsibilities: formattedResponsibilities,
        skillsRequired: formattedSkills,
        packageLPA: packageLPA ? parseFloat(packageLPA) : 6.0,
        stipend: stipend || '₹25,000 / month',
        jobType: jobType || 'Full-Time',
        location: location || 'Bengaluru / Hybrid',
        openingsCount: openingsCount ? parseInt(openingsCount) : 5,
        eligibility: {
          minCgpa: eligibility?.minCgpa !== undefined ? parseFloat(eligibility.minCgpa) : 6.5,
          allowedBranches: eligibility?.allowedBranches || ['Computer Science (CSE)', 'Information Technology (IT)'],
          maxBacklogs: eligibility?.maxBacklogs !== undefined ? parseInt(eligibility.maxBacklogs) : 0,
        },
        deadline: deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: status || 'Active',
      });

      return res.status(201).json({ success: true, message: 'Job drive posted successfully!', job });
    } else {
      const prof = memoryStore.companyProfiles.find((p) => p.user.toString() === req.user._id.toString());
      const newJobId = 'job_' + Date.now();
      const newJob = {
        _id: newJobId,
        company: req.user._id,
        companyProfile: prof ? prof._id : null,
        title,
        role: role || 'Software Development',
        description,
        responsibilities: formattedResponsibilities,
        skillsRequired: formattedSkills,
        packageLPA: packageLPA ? parseFloat(packageLPA) : 6.0,
        stipend: stipend || '₹25,000 / month',
        jobType: jobType || 'Full-Time',
        location: location || 'Bengaluru / Hybrid',
        openingsCount: openingsCount ? parseInt(openingsCount) : 5,
        eligibility: {
          minCgpa: eligibility?.minCgpa !== undefined ? parseFloat(eligibility.minCgpa) : 6.5,
          allowedBranches: eligibility?.allowedBranches || ['Computer Science (CSE)', 'Information Technology (IT)'],
          maxBacklogs: eligibility?.maxBacklogs !== undefined ? parseInt(eligibility.maxBacklogs) : 0,
        },
        deadline: deadline ? new Date(deadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: status || 'Active',
        createdAt: new Date(),
      };
      memoryStore.jobs.unshift(newJob);
      return res.status(201).json({ success: true, message: 'Job drive posted successfully!', job: newJob });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error creating job drive.' });
  }
};

// @desc    Update existing job drive
// @route   PUT /api/jobs/:id
// @access  Private (Company or Admin)
exports.updateJob = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      let job = await Job.findById(req.params.id);
      if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });

      job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      return res.status(200).json({ success: true, message: 'Job drive updated successfully!', job });
    } else {
      let job = memoryStore.jobs.find((j) => j._id.toString() === req.params.id.toString());
      if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });

      Object.assign(job, req.body);
      return res.status(200).json({ success: true, message: 'Job drive updated successfully!', job });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error updating job drive.' });
  }
};

// @desc    Delete job drive
// @route   DELETE /api/jobs/:id
// @access  Private (Company or Admin)
exports.deleteJob = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const job = await Job.findById(req.params.id);
      if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });

      await Application.deleteMany({ job: job._id });
      await job.deleteOne();
      return res.status(200).json({ success: true, message: 'Job drive removed.' });
    } else {
      const index = memoryStore.jobs.findIndex((j) => j._id.toString() === req.params.id.toString());
      if (index === -1) return res.status(404).json({ success: false, message: 'Job not found.' });

      memoryStore.jobs.splice(index, 1);
      memoryStore.applications = memoryStore.applications.filter((a) => a.job.toString() !== req.params.id.toString());
      return res.status(200).json({ success: true, message: 'Job drive removed.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error deleting job drive.' });
  }
};

// @desc    Get jobs posted by the logged-in company
// @route   GET /api/jobs/my-jobs
// @access  Private (Company)
exports.getCompanyJobs = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const jobs = await Job.find({ company: req.user._id }).sort({ createdAt: -1 });
      const jobsWithCounts = await Promise.all(
        jobs.map(async (job) => {
          const count = await Application.countDocuments({ job: job._id });
          const shortlisted = await Application.countDocuments({ job: job._id, status: 'Shortlisted' });
          const selected = await Application.countDocuments({ job: job._id, status: 'Selected' });
          return {
            ...job.toObject(),
            totalApplicants: count,
            shortlistedCount: shortlisted,
            selectedCount: selected,
          };
        })
      );
      return res.status(200).json({ success: true, jobs: jobsWithCounts });
    } else {
      const jobs = memoryStore.jobs.filter((j) => j.company.toString() === req.user._id.toString());
      const jobsWithCounts = jobs.map((job) => {
        const apps = memoryStore.applications.filter((a) => a.job.toString() === job._id.toString());
        return {
          ...job,
          totalApplicants: apps.length,
          shortlistedCount: apps.filter((a) => a.status === 'Shortlisted').length,
          selectedCount: apps.filter((a) => a.status === 'Selected').length,
        };
      });
      return res.status(200).json({ success: true, jobs: jobsWithCounts });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching company job drives.' });
  }
};
