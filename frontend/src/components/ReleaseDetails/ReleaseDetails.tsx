import React from "react";
import { useQuery } from "@apollo/client";
import { GET_RELEASE_DETAILS } from "../../graphql/queries";
import { FiX, FiExternalLink, FiGitCommit } from "react-icons/fi";
import { Commit } from "../../types";
import "./ReleaseDetails.scss";

interface ReleaseDetailsProps {
  repositoryId: string;
  releaseId: string;
  onClose: () => void;
}

export const ReleaseDetails: React.FC<ReleaseDetailsProps> = ({
  repositoryId,
  releaseId,
  onClose,
}) => {
  const { data, loading, error } = useQuery(GET_RELEASE_DETAILS, {
    variables: { repositoryId, releaseId },
  });

  if (loading) {
    return (
      <div className="release-details">
        <div className="overlay" onClick={onClose}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="loading">Loading release details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="release-details">
        <div className="overlay" onClick={onClose}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="error">
              <h3>Error loading release details</h3>
              <p>{error.message}</p>
              <button onClick={onClose} className="btn btn--primary">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { release, commits } = data?.releaseDetails || {};

  if (!release) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="release-details">
      <div className="overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="header">
            <h2>
              Release: <span className="tag">{release.tagName}</span>
            </h2>
            <button onClick={onClose} className="close" aria-label="Close">
              <FiX />
            </button>
          </div>

          <div className="content">
            {release.name && (
              <div className="section">
                <h3>{release.name}</h3>
              </div>
            )}

            <div className="section">
              <p className="meta">
                <strong>Published:</strong> {formatDate(release.publishedAt)}
              </p>
              <a
                href={release.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                View on GitHub <FiExternalLink />
              </a>
            </div>

            {release.body && (
              <div className="section">
                <h3>Release Notes</h3>
                <div className="notes">
                  <pre>{release.body}</pre>
                </div>
              </div>
            )}

            {commits && commits.length > 0 && (
              <div className="section">
                <h3>
                  <FiGitCommit className="icon" />
                  Commits ({commits.length})
                </h3>
                <div className="commits__list">
                  {commits.map((commit: Commit) => (
                    <div key={commit.sha} className="commits__item">
                      <div className="commits__header">
                        <a
                          href={commit.htmlUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="commits__sha"
                        >
                          <FiGitCommit /> {commit.sha}
                        </a>
                        <span className="commits__message">
                          {commit.message}
                        </span>
                      </div>
                      <div className="commits__author">
                        <strong>{commit.author.name}</strong>
                        <span className="commits__date">
                          {formatDate(commit.author.date)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(!commits || commits.length === 0) && (
              <div className="section">
                <p className="empty">
                  No commit history available for this release.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

