export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  owner: {
    login: string;
  };
}

export interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string | null;
  published_at: string;
  body: string | null;
  html_url: string;
}

export interface GitHubCommit {
  sha: string;
  message: string;
  author: {
    name: string;
    email: string;
    date: string;
  };
  html_url: string;
}
