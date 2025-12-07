import React from "react";
import "./ErrorState.scss";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="error-state">
      <h2>Error loading repositories</h2>
      <p>{message}</p>
      <button onClick={onRetry} className="btn btn--primary">
        Retry
      </button>
    </div>
  );
};

