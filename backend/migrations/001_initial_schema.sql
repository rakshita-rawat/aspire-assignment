-- Create repositories table
CREATE TABLE IF NOT EXISTS repositories (
  id SERIAL PRIMARY KEY,
  github_id BIGINT NOT NULL UNIQUE,
  owner VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  description TEXT,
  html_url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(owner, name)
);

-- Create releases table
CREATE TABLE IF NOT EXISTS releases (
  id SERIAL PRIMARY KEY,
  repository_id INTEGER NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
  github_release_id BIGINT NOT NULL UNIQUE,
  tag_name VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  published_at TIMESTAMP NOT NULL,
  body TEXT,
  html_url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create seen_status table
CREATE TABLE IF NOT EXISTS seen_status (
  id SERIAL PRIMARY KEY,
  repository_id INTEGER NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
  release_id INTEGER NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
  seen_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(repository_id, release_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_repositories_owner_name ON repositories(owner, name);
CREATE INDEX IF NOT EXISTS idx_releases_repository_id ON releases(repository_id);
CREATE INDEX IF NOT EXISTS idx_releases_published_at ON releases(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_seen_status_repository_id ON seen_status(repository_id);
CREATE INDEX IF NOT EXISTS idx_seen_status_release_id ON seen_status(release_id);

