import React, { useState, useEffect } from 'react';
import { CloseIcon, BriefcaseIcon } from './Icons';

export const ApplicationForm = ({ isOpen, onClose, onAddApplication }) => {
  // Today's date formatted as YYYY-MM-DD for the date input default
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const initialFormState = {
    company: '',
    role: '',
    status: 'Applied',
    jobType: 'Full-time',
    location: '',
    date: getTodayDate(),
    salary: '',
    notes: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  // Close modal when pressing the Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset form whenever modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormState);
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }
    if (!formData.role.trim()) {
      newErrors.role = 'Job role is required';
    }
    if (!formData.date) {
      newErrors.date = 'Application date is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Create the new application object
    const newApp = {
      id: `app-${Date.now()}`,
      company: formData.company.trim(),
      role: formData.role.trim(),
      status: formData.status,
      jobType: formData.jobType,
      location: formData.location.trim() || 'Not specified',
      date: formData.date,
      salary: formData.salary.trim() || '',
      notes: formData.notes.trim() || '',
    };

    onAddApplication(newApp);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-title-icon">
              <BriefcaseIcon className="icon-sm" />
            </div>
            <div>
              <h2 className="modal-title">Track New Application</h2>
              <p className="modal-subtitle">Add details about your campus or off-campus application</p>
            </div>
          </div>
          <button
            id="close-modal-btn"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
            type="button"
          >
            <CloseIcon className="icon-sm" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="modal-form" id="application-form">
          <div className="form-grid">
            {/* Company Name */}
            <div className="form-group">
              <label htmlFor="company" className="form-label">
                Company Name <span className="required-star">*</span>
              </label>
              <input
                id="company"
                name="company"
                type="text"
                className={`form-input ${errors.company ? 'input-error' : ''}`}
                placeholder="e.g. Google, Microsoft, Atlassian"
                value={formData.company}
                onChange={handleChange}
                autoFocus
              />
              {errors.company && <span className="error-message">{errors.company}</span>}
            </div>

            {/* Job Role */}
            <div className="form-group">
              <label htmlFor="role" className="form-label">
                Job Role / Position <span className="required-star">*</span>
              </label>
              <input
                id="role"
                name="role"
                type="text"
                className={`form-input ${errors.role ? 'input-error' : ''}`}
                placeholder="e.g. SDE-1, Full Stack Intern"
                value={formData.role}
                onChange={handleChange}
              />
              {errors.role && <span className="error-message">{errors.role}</span>}
            </div>

            {/* Status */}
            <div className="form-group">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                id="status"
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Applied">Applied</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Offered">Offered</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {/* Job Type */}
            <div className="form-group">
              <label htmlFor="jobType" className="form-label">
                Job Type
              </label>
              <select
                id="jobType"
                name="jobType"
                className="form-select"
                value={formData.jobType}
                onChange={handleChange}
              >
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            {/* Location */}
            <div className="form-group">
              <label htmlFor="location" className="form-label">
                Location / Mode
              </label>
              <input
                id="location"
                name="location"
                type="text"
                className="form-input"
                placeholder="e.g. Bengaluru, Remote, Hybrid"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            {/* Application Date */}
            <div className="form-group">
              <label htmlFor="date" className="form-label">
                Application Date <span className="required-star">*</span>
              </label>
              <input
                id="date"
                name="date"
                type="date"
                className={`form-input ${errors.date ? 'input-error' : ''}`}
                value={formData.date}
                onChange={handleChange}
              />
              {errors.date && <span className="error-message">{errors.date}</span>}
            </div>

            {/* Expected Salary / CTC */}
            <div className="form-group form-span-full">
              <label htmlFor="salary" className="form-label">
                Expected CTC / Stipend (Optional)
              </label>
              <input
                id="salary"
                name="salary"
                type="text"
                className="form-input"
                placeholder="e.g. ₹20-25 LPA or ₹60k/month"
                value={formData.salary}
                onChange={handleChange}
              />
            </div>

            {/* Notes */}
            <div className="form-group form-span-full">
              <label htmlFor="notes" className="form-label">
                Notes & Interview Schedule (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                rows="3"
                className="form-textarea"
                placeholder="e.g. Recruiter contact, OA link, rounds completed, next steps..."
                value={formData.notes}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          {/* Form Actions */}
          <div className="modal-actions">
            <button
              id="cancel-modal-btn"
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              id="submit-app-btn"
              type="submit"
              className="btn btn-primary"
            >
              Save Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
