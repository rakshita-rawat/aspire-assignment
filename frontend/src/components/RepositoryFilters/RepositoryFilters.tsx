import React from "react";
import "./RepositoryFilters.scss";

export type SortOption = "name-asc" | "name-desc" | "date-asc" | "date-desc" | "update-status";
export type FilterOption = "all" | "has-updates" | "no-updates";

interface RepositoryFiltersProps {
  sortBy: SortOption;
  filterBy: FilterOption;
  onSortChange: (sort: SortOption) => void;
  onFilterChange: (filter: FilterOption) => void;
}

export const RepositoryFilters: React.FC<RepositoryFiltersProps> = ({
  sortBy,
  filterBy,
  onSortChange,
  onFilterChange,
}) => {
  return (
    <div className="repository-filters">
      <div className="group">
        <label htmlFor="filter">Filter:</label>
        <select
          id="filter"
          value={filterBy}
          onChange={(e) => onFilterChange(e.target.value as FilterOption)}
          className="select"
        >
          <option value="all">All Repositories</option>
          <option value="has-updates">Has Updates</option>
          <option value="no-updates">No Updates</option>
        </select>
      </div>

      <div className="group">
        <label htmlFor="sort">Sort by:</label>
        <select
          id="sort"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="select"
        >
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="date-desc">Date Added (Newest First)</option>
          <option value="date-asc">Date Added (Oldest First)</option>
          <option value="update-status">Update Status</option>
        </select>
      </div>
    </div>
  );
};

