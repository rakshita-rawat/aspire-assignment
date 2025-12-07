import React from "react";
import { Repository } from "../../types";
import {
  FiRefreshCw,
  FiTrash2,
  FiExternalLink,
  FiGitBranch,
  FiGitCommit,
} from "react-icons/fi";
import "./RepositoryCard.scss";

interface RepositoryCardProps {
  repository: Repository;
  onRefresh: (id: string) => void;
  onDelete: (id: string) => void;
  onMarkAsSeen: (repositoryId: string, releaseId: string) => void;
  onViewDetails?: (repositoryId: string, releaseId: string) => void;
}

export const RepositoryCard: React.FC<RepositoryCardProps> = ({
  repository,
  onRefresh,
  onDelete,
  onMarkAsSeen,
  onViewDetails,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className={`repository-card ${
        repository.hasUnseenUpdates ? "repository-card--has-updates" : ""
      }`}
    >
      <div className="header">
        <div className="title">
          <h3>
            <a
              href={repository.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              {repository.fullName}
            </a>
          </h3>
          {repository.hasUnseenUpdates && (
            <span className="badge">
              <FiGitCommit /> New Update
            </span>
          )}
        </div>
        <div className="actions">
          <button
            onClick={() => onRefresh(repository.id)}
            className="btn btn--icon"
            title="Refresh repository data"
            aria-label="Refresh"
          >
            <FiRefreshCw />
          </button>
          <button
            onClick={() => onDelete(repository.id)}
            className="btn btn--icon btn--icon-danger"
            title="Remove repository"
            aria-label="Delete"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>

      {repository.description && (
        <p className="description">{repository.description}</p>
      )}

      {repository.latestRelease ? (
        <div className="release">
          <div className="release-header">
            <h4>
              <FiGitBranch className="icon" />
              Latest Release:{" "}
              <span className="tag">{repository.latestRelease.tagName}</span>
            </h4>
            {!repository.latestRelease.isSeen && (
              <button
                onClick={() =>
                  onMarkAsSeen(repository.id, repository.latestRelease!.id)
                }
                className="btn btn--primary btn--small"
              >
                Mark as Seen
              </button>
            )}
          </div>
          {repository.latestRelease.name && (
            <p className="release-name">{repository.latestRelease.name}</p>
          )}
          <p className="release-date">
            Published: {formatDate(repository.latestRelease.publishedAt)}
          </p>
          {repository.latestRelease.body && (
            <div className="release-notes">
              <p>{repository.latestRelease.body.substring(0, 200)}</p>
              {repository.latestRelease.body.length > 200 && "..."}
            </div>
          )}
          <div className="release-actions">
            {onViewDetails && (
              <button
                onClick={() =>
                  onViewDetails(repository.id, repository.latestRelease!.id)
                }
                className="btn btn--primary btn--small"
              >
                View Details
              </button>
            )}
            <a
              href={repository.latestRelease.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="release-link"
            >
              View on GitHub <FiExternalLink />
            </a>
          </div>
        </div>
      ) : (
        <div className="empty">
          <p>No releases found for this repository.</p>
        </div>
      )}
    </div>
  );
};

