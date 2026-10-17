import React from 'react';
import { SearchIcon, FilterIcon, CloseIcon, PlusIcon } from './Icons';

export const FilterBar = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  onResetFilters,
  totalCount,
  filteredCount,
  onOpenModal,
}) => {
  const isFiltered = searchTerm.trim() !== '' || statusFilter !== 'All';

  return (
    <div className="filter-bar">
      <div className="filter-controls">
        {/* Search Input */}
        <div className="search-input-wrapper">
          <SearchIcon className="search-icon" />
          <input
            id="search-input"
            type="text"
            className="search-input"
            placeholder="Search by company or role..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchTerm && (
            <button
              id="clear-search-btn"
              className="clear-search-btn"
              onClick={() => onSearchChange('')}
              title="Clear search"
              type="button"
            >
              <CloseIcon className="close-icon-sm" />
            </button>
          )}
        </div>

        {/* Status Filter Dropdown */}
        <div className="status-select-wrapper">
          <FilterIcon className="filter-icon" />
          <select
            id="status-select"
            className="status-select"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Offered">Offered</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Reset Filters button if any filter applied */}
        {isFiltered && (
          <button
            id="reset-filters-btn"
            className="btn btn-secondary btn-sm"
            onClick={onResetFilters}
            title="Reset search and filters"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Right side: Results counter & Add button */}
      <div className="filter-bar-right">
        <span className="results-counter" id="results-count">
          Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> applications
        </span>
        <button
          id="filter-add-btn"
          className="btn btn-primary btn-sm"
          onClick={onOpenModal}
        >
          <PlusIcon className="btn-icon" />
          <span>Add Application</span>
        </button>
      </div>
    </div>
  );
};
