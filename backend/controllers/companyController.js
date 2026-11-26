const mongoose = require('mongoose');
const CompanyProfile = require('../models/CompanyProfile');
const Job = require('../models/Job');
const memoryStore = require('../config/inMemoryStore');

// @desc    Get current company's profile
// @route   GET /api/companies/profile
// @access  Private (Company)
exports.getCompanyProfile = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      let profile = await CompanyProfile.findOne({ user: req.user._id }).populate('user', 'name email avatar role');
      if (!profile) {
        profile = await CompanyProfile.create({
          user: req.user._id,
          companyName: req.user.name,
          industry: 'Software & Technology',
          location: 'Bengaluru / Hybrid',
        });
        profile = await profile.populate('user', 'name email avatar role');
      }
      return res.status(200).json({ success: true, profile });
    } else {
      let profile = memoryStore.companyProfiles.find((p) => p.user.toString() === req.user._id.toString());
      if (!profile) {
        profile = {
          _id: 'cprof_' + req.user._id,
          user: req.user._id,
          companyName: req.user.name,
          industry: 'Software & Technology',
          location: 'Bengaluru / Hybrid',
          isVerified: true,
        };
        memoryStore.companyProfiles.push(profile);
      }
      return res.status(200).json({ success: true, profile: { ...profile, user: req.user } });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching company profile.' });
  }
};

// @desc    Update company profile
// @route   PUT /api/companies/profile
// @access  Private (Company)
exports.updateCompanyProfile = async (req, res) => {
  try {
    const { companyName, website, industry, location, description, contactPerson, contactEmail, contactPhone, logoUrl } = req.body;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const profile = await CompanyProfile.findOneAndUpdate(
        { user: req.user._id },
        {
          $set: {
            companyName,
            website,
            industry,
            location,
            description,
            contactPerson,
            contactEmail,
            contactPhone,
            logoUrl,
          },
        },
        { new: true, upsert: true, runValidators: true }
      ).populate('user', 'name email avatar role');

      return res.status(200).json({ success: true, message: 'Company profile updated successfully!', profile });
    } else {
      let profile = memoryStore.companyProfiles.find((p) => p.user.toString() === req.user._id.toString());
      if (profile) {
        if (companyName) profile.companyName = companyName;
        if (website) profile.website = website;
        if (industry) profile.industry = industry;
        if (location) profile.location = location;
        if (description) profile.description = description;
      }
      return res.status(200).json({ success: true, message: 'Company profile updated successfully!', profile });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error updating company profile.' });
  }
};

// @desc    Get list of verified companies
// @route   GET /api/companies
// @access  Public
exports.getAllCompanies = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const companies = await CompanyProfile.find({ isVerified: true })
        .populate('user', 'name email avatar isApproved')
        .sort({ companyName: 1 });

      const enriched = await Promise.all(
        companies.map(async (c) => {
          const activeJobsCount = await Job.countDocuments({ company: c.user?._id, status: 'Active' });
          return { ...c.toObject(), activeJobsCount };
        })
      );

      return res.status(200).json({ success: true, companies: enriched });
    } else {
      const companies = memoryStore.companyProfiles.map((c) => {
        const u = memoryStore.users.find((user) => user._id.toString() === c.user.toString());
        const count = memoryStore.jobs.filter(
          (j) => j.company.toString() === c.user.toString() && j.status === 'Active'
        ).length;

        return {
          ...c,
          user: u ? { _id: u._id, name: u.name, email: u.email, isApproved: u.isApproved } : null,
          activeJobsCount: count,
        };
      });

      return res.status(200).json({ success: true, companies });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching companies list.' });
  }
};
