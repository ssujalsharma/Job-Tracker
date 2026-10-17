const mongoose = require('mongoose');
const Application = require('../models/Application');

// In-memory fallback dataset in case MongoDB is temporarily not connected
let memoryApplications = [
  {
    id: 'app-1',
    company: 'Google',
    role: 'Associate Software Engineer',
    jobType: 'Full-time',
    location: 'Bengaluru, India (Hybrid)',
    date: '2026-10-14',
    status: 'Interviewing',
    salary: '₹28-34 LPA',
    notes: 'Cleared Online Assessment (OA). Round 1 Technical scheduled for this Friday.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'app-2',
    company: 'Microsoft',
    role: 'Software Engineering Intern',
    jobType: 'Internship',
    location: 'Hyderabad, India (On-site)',
    date: '2026-10-10',
    status: 'Offered',
    salary: '₹1.25L / month stipend',
    notes: 'Offer letter received! Need to submit acceptance form by next week.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'app-3',
    company: 'Stripe',
    role: 'Full Stack Developer',
    jobType: 'Full-time',
    location: 'Remote',
    date: '2026-10-08',
    status: 'Interviewing',
    salary: '₹24-30 LPA',
    notes: 'System design round completed. Waiting for hiring manager round feedback.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'app-4',
    company: 'Amazon (AWS)',
    role: 'SDE-1 (Cloud Services)',
    jobType: 'Full-time',
    location: 'Bengaluru, India (Hybrid)',
    date: '2026-09-28',
    status: 'Applied',
    salary: '₹22-26 LPA',
    notes: 'Applied via college campus placement portal. Resume under review.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'app-5',
    company: 'Swiggy',
    role: 'Frontend Engineer Intern',
    jobType: 'Internship',
    location: 'Bengaluru, India (On-site)',
    date: '2026-09-22',
    status: 'Offered',
    salary: '₹65k / month stipend',
    notes: 'HR discussion completed. PPO (Pre-Placement Offer) conversion potential.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'app-6',
    company: 'Goldman Sachs',
    role: 'Analyst - Software Engineering',
    jobType: 'Full-time',
    location: 'Bengaluru, India (On-site)',
    date: '2026-09-15',
    status: 'Rejected',
    salary: '₹22-25 LPA',
    notes: 'Technical coding round was tricky with DP problem. Keep practicing LeetCode.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'app-7',
    company: 'Razorpay',
    role: 'Graduate Trainee - Engineering',
    jobType: 'Full-time',
    location: 'Bengaluru, India (Hybrid)',
    date: '2026-10-02',
    status: 'Applied',
    salary: '₹18-22 LPA',
    notes: 'Referral from alumni on LinkedIn. OA link expected soon.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'app-8',
    company: 'Uber',
    role: 'Backend Engineer Intern',
    jobType: 'Internship',
    location: 'Hyderabad, India (Hybrid)',
    date: '2026-09-10',
    status: 'Rejected',
    salary: '₹1.1L / month stipend',
    notes: 'Reached final behavioral round. Position closed due to cohort capacity.',
    createdAt: new Date().toISOString(),
  },
];

// Helper to check if MongoDB connection is active (1 = connected)
const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * @desc    Get all job applications (with optional search and status filter query params)
 * @route   GET /api/applications
 * @access  Public
 */
const getApplications = async (req, res, next) => {
  try {
    const { search, status } = req.query;

    if (isDbConnected()) {
      const query = {};

      if (status && status !== 'All') {
        query.status = status;
      }

      if (search && search.trim() !== '') {
        const searchRegex = new RegExp(search.trim(), 'i');
        query.$or = [
          { company: searchRegex },
          { role: searchRegex },
          { location: searchRegex },
        ];
      }

      const applications = await Application.find(query).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: applications.length,
        dataSource: 'mongodb',
        data: applications,
      });
    }

    // In-memory fallback if MongoDB is not connected
    let results = [...memoryApplications];

    if (status && status !== 'All') {
      results = results.filter((app) => app.status === status);
    }

    if (search && search.trim() !== '') {
      const q = search.toLowerCase();
      results = results.filter(
        (app) =>
          app.company.toLowerCase().includes(q) ||
          app.role.toLowerCase().includes(q) ||
          (app.location && app.location.toLowerCase().includes(q))
      );
    }

    return res.status(200).json({
      success: true,
      count: results.length,
      dataSource: 'in-memory (MongoDB offline)',
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single job application by ID
 * @route   GET /api/applications/:id
 * @access  Public
 */
const getApplicationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const application = await Application.findById(id);
      if (!application) {
        return res.status(404).json({ success: false, message: `Application with id ${id} not found` });
      }
      return res.status(200).json({ success: true, data: application });
    }

    const application = memoryApplications.find((app) => app.id === id);
    if (!application) {
      return res.status(404).json({ success: false, message: `Application with id ${id} not found` });
    }
    return res.status(200).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new job application
 * @route   POST /api/applications
 * @access  Public
 */
const createApplication = async (req, res, next) => {
  try {
    const { company, role, status, jobType, location, date, salary, notes } = req.body;

    if (!company || !role || !date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide company name, job role, and application date',
      });
    }

    if (isDbConnected()) {
      const newApp = await Application.create({
        company,
        role,
        status: status || 'Applied',
        jobType: jobType || 'Full-time',
        location: location || 'Not specified',
        date,
        salary: salary || '',
        notes: notes || '',
      });

      return res.status(201).json({
        success: true,
        message: 'Application created successfully',
        data: newApp,
      });
    }

    // In-memory fallback
    const fallbackApp = {
      id: `app-${Date.now()}`,
      company: company.trim(),
      role: role.trim(),
      status: status || 'Applied',
      jobType: jobType || 'Full-time',
      location: location?.trim() || 'Not specified',
      date,
      salary: salary?.trim() || '',
      notes: notes?.trim() || '',
      createdAt: new Date().toISOString(),
    };

    memoryApplications.unshift(fallbackApp);

    return res.status(201).json({
      success: true,
      message: 'Application created in memory (MongoDB offline)',
      data: fallbackApp,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing job application (or update status)
 * @route   PUT /api/applications/:id
 * @access  Public
 */
const updateApplication = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const updatedApp = await Application.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updatedApp) {
        return res.status(404).json({ success: false, message: `Application with id ${id} not found` });
      }

      return res.status(200).json({
        success: true,
        message: 'Application updated successfully',
        data: updatedApp,
      });
    }

    // In-memory fallback
    const index = memoryApplications.findIndex((app) => app.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: `Application with id ${id} not found` });
    }

    memoryApplications[index] = {
      ...memoryApplications[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    return res.status(200).json({
      success: true,
      message: 'Application updated in memory (MongoDB offline)',
      data: memoryApplications[index],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a job application
 * @route   DELETE /api/applications/:id
 * @access  Public
 */
const deleteApplication = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const deletedApp = await Application.findByIdAndDelete(id);
      if (!deletedApp) {
        return res.status(404).json({ success: false, message: `Application with id ${id} not found` });
      }

      return res.status(200).json({
        success: true,
        message: 'Application deleted successfully',
        data: { id },
      });
    }

    // In-memory fallback
    const index = memoryApplications.findIndex((app) => app.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: `Application with id ${id} not found` });
    }

    const [removed] = memoryApplications.splice(index, 1);
    return res.status(200).json({
      success: true,
      message: 'Application deleted from memory (MongoDB offline)',
      data: { id: removed.id },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Seed database with sample placement applications
 * @route   POST /api/applications/seed
 * @access  Public
 */
const seedApplications = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      await Application.deleteMany({});
      const seeded = await Application.insertMany(memoryApplications.map(app => {
        const { id, ...rest } = app;
        return rest;
      }));

      return res.status(201).json({
        success: true,
        message: `Seeded ${seeded.length} sample applications into MongoDB`,
        count: seeded.length,
        data: seeded,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Sample data restored in memory',
      count: memoryApplications.length,
      data: memoryApplications,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
  seedApplications,
};
