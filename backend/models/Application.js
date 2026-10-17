const mongoose = require('mongoose');

/**
 * Job Application Mongoose Schema
 * Defines the structure, data types, and validation rules for each job application document.
 */
const applicationSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    role: {
      type: String,
      required: [true, 'Job role is required'],
      trim: true,
      maxlength: [100, 'Job role cannot exceed 100 characters'],
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: ['Applied', 'Interviewing', 'Offered', 'Rejected'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Applied',
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Internship', 'Contract'],
      default: 'Full-time',
    },
    location: {
      type: String,
      trim: true,
      default: 'Not specified',
    },
    date: {
      type: String,
      required: [true, 'Application date is required'],
      trim: true,
    },
    salary: {
      type: String,
      trim: true,
      default: '',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

// Virtual field or transform to format _id as id for frontend compatibility
applicationSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    return ret;
  },
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
