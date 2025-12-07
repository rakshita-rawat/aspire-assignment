import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_REPOSITORIES,
  ADD_REPOSITORY,
  DELETE_REPOSITORY,
  REFRESH_REPOSITORY,
  REFRESH_ALL_REPOSITORIES,
  MARK_RELEASE_AS_SEEN,
} from "../../graphql/queries";
import { Header } from "../Header/Header";
import { AddRepositoryForm } from "../AddRepositoryForm/AddRepositoryForm";
import { RepositoriesList } from "../RepositoriesList/RepositoriesList";
import { LoadingState } from "../LoadingState/LoadingState";
import { ErrorState } from "../ErrorState/ErrorState";
import { EmptyState } from "../EmptyState/EmptyState";
import { ReleaseDetails } from "../ReleaseDetails/ReleaseDetails";
import {
  SortOption,
  FilterOption,
} from "../RepositoryFilters/RepositoryFilters";
import "./Dashboard.scss";

const REFETCH_QUERIES = [{ query: GET_REPOSITORIES }];

export const Dashboard: React.FC = () => {
  const { data, loading, error, refetch } = useQuery(GET_REPOSITORIES);
  const [addRepository] = useMutation(ADD_REPOSITORY);
  const [deleteRepository] = useMutation(DELETE_REPOSITORY);
  const [refreshRepository] = useMutation(REFRESH_REPOSITORY);
  const [refreshAllRepositories] = useMutation(REFRESH_ALL_REPOSITORIES);
  const [markReleaseAsSeen] = useMutation(MARK_RELEASE_AS_SEEN);

  const [isAdding, setIsAdding] = useState(false);
  const [isRefreshingAll, setIsRefreshingAll] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const [selectedRelease, setSelectedRelease] = useState<{
    repositoryId: string;
    releaseId: string;
  } | null>(null);

  const handleAddRepository = async (url: string) => {
    setIsAdding(true);
    try {
      await addRepository({
        variables: { url },
        refetchQueries: REFETCH_QUERIES,
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteRepository = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this repository?")) {
      await deleteRepository({
        variables: { id },
        refetchQueries: REFETCH_QUERIES,
      });
    }
  };

  const handleRefreshRepository = async (id: string) => {
    await refreshRepository({
      variables: { id },
      refetchQueries: REFETCH_QUERIES,
    });
  };

  const handleRefreshAll = async () => {
    setIsRefreshingAll(true);
    try {
      await refreshAllRepositories({
        refetchQueries: REFETCH_QUERIES,
      });
    } finally {
      setIsRefreshingAll(false);
    }
  };

  const handleMarkAsSeen = async (repositoryId: string, releaseId: string) => {
    await markReleaseAsSeen({
      variables: { repositoryId, releaseId },
      refetchQueries: REFETCH_QUERIES,
    });
  };

  if (loading && !data) {
    return (
      <div className="app">
        <div className="app__container">
          <LoadingState />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="app__container">
          <ErrorState message={error.message} onRetry={() => refetch()} />
        </div>
      </div>
    );
  }

  const repositories = data?.repositories || [];

  return (
    <div className="app">
      <div className="app__container">
        <Header />

        <AddRepositoryForm onAdd={handleAddRepository} isLoading={isAdding} />

        {repositories.length === 0 ? (
          <EmptyState
            title="No repositories tracked yet"
            message="Add a GitHub repository to start tracking its releases!"
          />
        ) : (
          <RepositoriesList
            repositories={repositories}
            sortBy={sortBy}
            filterBy={filterBy}
            isRefreshingAll={isRefreshingAll}
            onSortChange={setSortBy}
            onFilterChange={setFilterBy}
            onRefreshAll={handleRefreshAll}
            onRefresh={handleRefreshRepository}
            onDelete={handleDeleteRepository}
            onMarkAsSeen={handleMarkAsSeen}
            onViewDetails={(repositoryId, releaseId) =>
              setSelectedRelease({ repositoryId, releaseId })
            }
          />
        )}

        {selectedRelease && (
          <ReleaseDetails
            repositoryId={selectedRelease.repositoryId}
            releaseId={selectedRelease.releaseId}
            onClose={() => setSelectedRelease(null)}
          />
        )}
      </div>
    </div>
  );
};
