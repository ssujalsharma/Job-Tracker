import React from 'react';
import { TrashIcon, MapPinIcon, CalendarIcon, BriefcaseIcon } from './Icons';

export const ApplicationTable = ({
  applications,
  onStatusChange,
  onDeleteApplication,
  onOpenModal,
  onResetFilters,
  isFiltered,
}) => {
  // Format dates gracefully (e.g. "Oct 14, 2026")
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      const [year, month, day] = dateString.split('-');
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // Status badge styling helper
  const getStatusBadge = (status) => {
    const statusMap = {
      Applied: { className: 'badge-applied', label: 'Applied' },
      Interviewing: { className: 'badge-interviewing', label: 'Interviewing' },
      Offered: { className: 'badge-offered', label: 'Offered' },
      Rejected: { className: 'badge-rejected', label: 'Rejected' },
    };

    const current = statusMap[status] || { className: 'badge-default', label: status };

    return (
      <span className={`status-badge ${current.className}`}>
        <span className="badge-dot"></span>
        {current.label}
      </span>
    );
  };

  if (applications.length === 0) {
    return (
      <div className="empty-state-card">
        <div className="empty-icon-wrapper">
          <BriefcaseIcon className="empty-icon" />
        </div>
        <h3 className="empty-title">No applications found</h3>
        <p className="empty-desc">
          {isFiltered
            ? 'No job applications match your current search or status filter.'
            : 'You haven’t tracked any job applications yet. Add your first application to get started!'}
        </p>
        <div className="empty-actions">
          {isFiltered ? (
            <button className="btn btn-secondary" onClick={onResetFilters}>
              Clear Filters
            </button>
          ) : (
            <button className="btn btn-primary" onClick={onOpenModal}>
              Add Your First Application
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="applications-table" id="applications-table">
        <thead>
          <tr>
            <th>Company & Details</th>
            <th>Role & Type</th>
            <th>Applied Date</th>
            <th>Current Status</th>
            <th>Update Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => {
            const appId = app.id || app._id;
            return (
              <tr key={appId} id={`app-row-${appId}`} className="table-row">
                {/* Company & Details */}
                <td>
                  <div className="company-cell">
                    <div className="company-avatar">
                      {app.company.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="company-name">{app.company}</span>
                      <div className="company-subinfo">
                        {app.location && (
                          <span className="location-pill">
                            <MapPinIcon className="inline-icon" />
                            {app.location}
                          </span>
                        )}
                        {app.salary && (
                          <span className="salary-pill">{app.salary}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Role & Notes */}
                <td>
                  <div className="role-cell">
                    <span className="role-title">{app.role}</span>
                    <div className="role-subinfo">
                      {app.jobType && (
                        <span className="jobtype-badge">{app.jobType}</span>
                      )}
                      {app.notes && (
                        <span className="role-notes" title={app.notes}>
                          {app.notes}
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Applied Date */}
                <td>
                  <div className="date-cell">
                    <CalendarIcon className="inline-icon text-muted" />
                    <span>{formatDate(app.date)}</span>
                  </div>
                </td>

                {/* Status Badge */}
                <td>{getStatusBadge(app.status)}</td>

                {/* Inline Status Changer */}
                <td>
                  <select
                    id={`status-select-${appId}`}
                    className="table-status-select"
                    value={app.status}
                    onChange={(e) => onStatusChange(appId, e.target.value)}
                    aria-label={`Change status for ${app.company}`}
                  >
                    <option value="Applied">Applied</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offered">Offered</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>

                {/* Actions (Delete) */}
                <td className="text-right">
                  <button
                    id={`delete-btn-${appId}`}
                    className="btn-action btn-delete"
                    title={`Delete application for ${app.company}`}
                    onClick={() => onDeleteApplication(appId, app.company)}
                    aria-label={`Delete ${app.company}`}
                  >
                    <TrashIcon className="btn-icon-sm" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
