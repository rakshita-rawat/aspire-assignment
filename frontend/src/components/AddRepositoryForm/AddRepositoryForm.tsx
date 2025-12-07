import React, { useState } from "react";
import "./AddRepositoryForm.scss";

interface AddRepositoryFormProps {
  onAdd: (url: string) => Promise<void>;
  isLoading: boolean;
}

export const AddRepositoryForm: React.FC<AddRepositoryFormProps> = ({
  onAdd,
  isLoading,
}) => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!url.trim()) {
      setError("Please enter a repository URL");
      return;
    }

    try {
      await onAdd(url.trim());
      setUrl("");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add repository";
      setError(errorMessage);
    }
  };

  return (
    <div className="add-repository-form">
      <h2>Track a New Repository</h2>
      <form onSubmit={handleSubmit}>
        <div className="group">
          <label htmlFor="repo-url">GitHub Repository URL</label>
          <input
            id="repo-url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/owner/repo or owner/repo"
            disabled={isLoading}
            className={error ? "error" : ""}
          />
          {error && <span className="error-message">{error}</span>}
        </div>
        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="btn btn--primary"
        >
          {isLoading ? "Adding..." : "Add Repository"}
        </button>
      </form>
    </div>
  );
};

