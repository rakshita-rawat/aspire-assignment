import React from "react";
import { FiGitBranch } from "react-icons/fi";
import "./Header.scss";

export const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header__content">
        <FiGitBranch className="header__icon" />
        <div>
          <h1>GitHub Repository Tracker</h1>
          <p className="header__subtitle">
            Track your favorite repositories and stay updated with latest
            releases
          </p>
        </div>
      </div>
    </header>
  );
};

