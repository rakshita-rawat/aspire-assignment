export interface MockRepository {
  id: number;
  github_id: number;
  owner: string;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  created_at: Date;
  updated_at: Date;
}

export interface MockRelease {
  id: number;
  repository_id: number;
  github_release_id: number;
  tag_name: string;
  name: string | null;
  published_at: Date;
  body: string | null;
  html_url: string;
  created_at: Date;
  updated_at: Date;
}

export interface MockCommit {
  sha: string;
  message: string;
  author: {
    name: string;
    email: string;
    date: string;
  };
  html_url: string;
}

