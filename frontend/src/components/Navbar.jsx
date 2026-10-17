import React from 'react';
import { BriefcaseIcon, PlusIcon } from './Icons';

export const Navbar = ({ onOpenModal, totalCount, apiOnline }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-icon-wrapper">
            <BriefcaseIcon className="brand-icon" />
          </div>
          <div>
            <div className="brand-title-row">
              <h1 className="brand-title">JobTrack</h1>
              <span className="brand-badge">College Placement</span>
            </div>
            <p className="brand-subtitle">MERN Job Application & Interview Pipeline</p>
          </div>
        </div>

        <div className="navbar-actions">
          {/* API Status Indicator */}
          <div
            className={`api-status-pill ${apiOnline ? 'api-status-online' : 'api-status-offline'}`}
            title={apiOnline ? 'Express REST API connected on Port 5000' : 'Express API unreachable (Fallback mode)'}
          >
            <span className={`status-dot ${apiOnline ? 'dot-online' : 'dot-offline'}`}></span>
            <span>{apiOnline ? 'API: Connected' : 'API: Offline'}</span>
          </div>

          <div className="date-pill" title="Today's Date">
            <span className="date-indicator"></span>
            <span>{currentDate}</span>
          </div>
          <button 
            id="nav-add-btn" 
            className="btn btn-primary"
            onClick={onOpenModal}
          >
            <PlusIcon className="btn-icon" />
            <span>New Application</span>
          </button>
        </div>
      </div>
    </header>
  );
};
