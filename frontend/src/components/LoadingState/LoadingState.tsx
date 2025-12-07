import React from "react";
import "./LoadingState.scss";

export const LoadingState: React.FC = () => {
  return (
    <div className="loading-state">
      <div className="loading-state__content">Loading repositories...</div>
    </div>
  );
};

