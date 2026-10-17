import React, { useState, useEffect } from 'react';
import { initialApplications } from './data/initialData';
import { Navbar } from './components/Navbar';
import { StatCards } from './components/StatCards';
import { FilterBar } from './components/FilterBar';
import { ApplicationTable } from './components/ApplicationTable';
import { ApplicationForm } from './components/ApplicationForm';
import { CheckCircleIcon } from './components/Icons';
import './App.css';




export function App() {
  // Load applications from localStorage if available, otherwise use initial sample data
  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem('jobtrack_applications');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore localStorage errors and fallback to initial data
    }
    return initialApplications;
  });



  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);



  // Sync applications to localStorage so data persists across browser reloads
  useEffect(() => {
    try {
      localStorage.setItem('jobtrack_applications', JSON.stringify(applications));
    } catch {
      // Ignore write errors
    }
  }, [applications]);

  // Show a temporary toast notification
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };



  // Add a new application
  const handleAddApplication = (newApp) => {
    setApplications((prev) => [newApp, ...prev]);
    showToast(`Added application for "${newApp.company}"`);
  };

  // Update application status
  const handleStatusChange = (id, newStatus) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
    showToast(`Updated status to "${newStatus}"`);
  };

  // Delete an application with browser confirmation
  const handleDeleteApplication = (id, companyName) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to remove the application for "${companyName}"?`
    );
    if (isConfirmed) {
      setApplications((prev) => prev.filter((app) => app.id !== id));
      showToast(`Removed "${companyName}" from your tracker`);
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
  };

  // Reset to initial sample data (helpful helper for demoing)
  const handleRestoreSampleData = () => {
    const isConfirmed = window.confirm(
      'Reset all data back to the default sample applications?'
    );
    if (isConfirmed) {
      setApplications(initialApplications);
      handleResetFilters();
      showToast('Restored default sample applications');
    }
  };

  // Filter applications based on searchTerm and statusFilter
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      searchTerm.trim() === '' ||
      app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.location && app.location.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === 'All' || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification" role="status">
          <CheckCircleIcon className="toast-icon" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        onOpenModal={() => setIsModalOpen(true)}
        totalCount={applications.length}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Hero Section */}
        <div className="dashboard-hero">
          <div className="hero-text">
            <h2 className="hero-title">Placement & Job Pipeline</h2>
            <p className="hero-description">
              Track your college placement drives, off-campus referrals, online assessments, and interview rounds in one place.
            </p>
          </div>
          <div className="hero-actions">
            <button
              className="btn btn-ghost btn-sm"
              onClick={handleRestoreSampleData}
              title="Reset data back to initial sample state"
            >
              Reset Sample Data
            </button>
          </div>
        </div>

        {/* 4 KPI Summary Cards */}
        <section className="section-stats" aria-label="Application Summary Metrics">
          <StatCards
            applications={applications}
            currentFilter={statusFilter}
            onSelectFilter={(selectedStatus) => setStatusFilter(selectedStatus)}
          />
        </section>

        {/* Filter & Search Bar */}
        <section className="section-filters" aria-label="Filters and Search">
          <FilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            onResetFilters={handleResetFilters}
            totalCount={applications.length}
            filteredCount={filteredApplications.length}
            onOpenModal={() => setIsModalOpen(true)}
          />
        </section>

        {/* Job Applications Data Table */}
        <section className="section-table" aria-label="Job Applications List">
          <ApplicationTable
            applications={filteredApplications}
            onStatusChange={handleStatusChange}
            onDeleteApplication={handleDeleteApplication}
            onOpenModal={() => setIsModalOpen(true)}
            onResetFilters={handleResetFilters}
            isFiltered={searchTerm.trim() !== '' || statusFilter !== 'All'}
          />
        </section>
      </main>

      {/* Modal Dialog for Adding an Application */}
      <ApplicationForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddApplication={handleAddApplication}
      />

      {/* Footer */}
      <footer className="footer">
        <p className="footer-text">
          <strong>JobTrack</strong> — Built with React & Vite • Milestone 1 (Frontend UI) • Ready for Express & MongoDB integration
        </p>
      </footer>
    </div>
  );
}

export default App;
