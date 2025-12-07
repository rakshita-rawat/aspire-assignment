import React from "react";
import { Repository } from "../../types";
import { RepositoryCard } from "../RepositoryCard/RepositoryCard";
import { RepositoryFilters, SortOption, FilterOption } from "../RepositoryFilters/RepositoryFilters";
import { EmptyState } from "../EmptyState/EmptyState";
import { FiRefreshCw } from "react-icons/fi";
import "./RepositoriesList.scss";

interface RepositoriesListProps {
  repositories: Repository[];
  sortBy: SortOption;
  filterBy: FilterOption;
  isRefreshingAll: boolean;
  onSortChange: (sort: SortOption) => void;
  onFilterChange: (filter: FilterOption) => void;
  onRefreshAll: () => void;
  onRefresh: (id: string) => void;
  onDelete: (id: string) => void;
  onMarkAsSeen: (repositoryId: string, releaseId: string) => void;
  onViewDetails: (repositoryId: string, releaseId: string) => void;
}

export const RepositoriesList: React.FC<RepositoriesListProps> = ({
  repositories,
  sortBy,
  filterBy,
  isRefreshingAll,
  onSortChange,
  onFilterChange,
  onRefreshAll,
  onRefresh,
  onDelete,
  onMarkAsSeen,
  onViewDetails,
}) => {
  // Filter repositories
  const filteredRepositories = repositories.filter((repo) => {
    if (filterBy === "has-updates") {
      return repo.hasUnseenUpdates;
    }
    if (filterBy === "no-updates") {
      return !repo.hasUnseenUpdates;
    }
    return true; // 'all'
  });

  // Sort repositories
  const sortedRepositories = [...filteredRepositories].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.fullName.localeCompare(b.fullName);
      case "name-desc":
        return b.fullName.localeCompare(a.fullName);
      case "date-asc":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "date-desc":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "update-status":
        // Has updates first, then no updates
        if (a.hasUnseenUpdates && !b.hasUnseenUpdates) return -1;
        if (!a.hasUnseenUpdates && b.hasUnseenUpdates) return 1;
        return 0;
      default:
        return 0;
    }
  });

  return (
    <div className="repositories-list">
      <div className="repositories-list__container">
        <div className="repositories-list__header">
          <div className="repositories-list__filters">
            <RepositoryFilters
              sortBy={sortBy}
              filterBy={filterBy}
              onSortChange={onSortChange}
              onFilterChange={onFilterChange}
            />
          </div>
          <div className="repositories-list__actions">
            <button
              onClick={onRefreshAll}
              disabled={isRefreshingAll}
              className="btn btn--secondary"
            >
              <FiRefreshCw
                className={isRefreshingAll ? "btn--spinning" : ""}
              />
              {isRefreshingAll ? "Refreshing..." : "Refresh All"}
            </button>
          </div>
        </div>

        <div className="repositories-list__items">
          {sortedRepositories.length === 0 ? (
            <EmptyState
              title="No repositories match your filters"
              message="Try adjusting your filter settings."
            />
          ) : (
            sortedRepositories.map((repo) => (
              <RepositoryCard
                key={repo.id}
                repository={repo}
                onRefresh={onRefresh}
                onDelete={onDelete}
                onMarkAsSeen={onMarkAsSeen}
                onViewDetails={onViewDetails}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

