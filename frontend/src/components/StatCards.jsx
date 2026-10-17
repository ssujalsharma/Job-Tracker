import React from 'react';
import { BriefcaseIcon, ClockIcon, AwardIcon, XCircleIcon } from './Icons';

export const StatCards = ({ applications = [], currentFilter, onSelectFilter }) => {
  const total = applications.length;
  const interviewing = applications.filter((app) => app.status === 'Interviewing').length;
  const offered = applications.filter((app) => app.status === 'Offered').length;
  const rejected = applications.filter((app) => app.status === 'Rejected').length;

  const cards = [
    {
      id: 'stat-total',
      label: 'Total Applications',
      count: total,
      subtext: 'Pipeline submissions',
      statusValue: 'All',
      icon: BriefcaseIcon,
      accentClass: 'accent-blue',
    },
    {
      id: 'stat-interviewing',
      label: 'Interviews Active',
      count: interviewing,
      subtext: 'In review / rounds',
      statusValue: 'Interviewing',
      icon: ClockIcon,
      accentClass: 'accent-amber',
    },
    {
      id: 'stat-offered',
      label: 'Offers Received',
      count: offered,
      subtext: 'Offers secured 🎉',
      statusValue: 'Offered',
      icon: AwardIcon,
      accentClass: 'accent-green',
    },
    {
      id: 'stat-rejected',
      label: 'Rejections',
      count: rejected,
      subtext: 'Archive / Practice',
      statusValue: 'Rejected',
      icon: XCircleIcon,
      accentClass: 'accent-rose',
    },
  ];

  return (
    <div className="stat-cards-grid">
      {cards.map((card) => {
        const IconComponent = card.icon;
        const isActive = currentFilter === card.statusValue;

        return (
          <div
            key={card.id}
            id={card.id}
            className={`stat-card ${card.accentClass} ${isActive ? 'stat-card-active' : ''}`}
            onClick={() => onSelectFilter(card.statusValue)}
            role="button"
            tabIndex={0}
            title={`Click to filter by ${card.label}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onSelectFilter(card.statusValue);
              }
            }}
          >
            <div className="stat-card-header">
              <span className="stat-card-label">{card.label}</span>
              <div className="stat-icon-wrapper">
                <IconComponent className="stat-icon" />
              </div>
            </div>
            <div className="stat-card-body">
              <span className="stat-card-count">{card.count}</span>
              <span className="stat-card-subtext">{card.subtext}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
