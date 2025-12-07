export interface Release {
  id: string;
  repositoryId: string;
  githubReleaseId: number;
  tagName: string;
  name: string | null;
  publishedAt: string;
  body: string | null;
  htmlUrl: string;
  isSeen: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Commit {
  sha: string;
  message: string;
  author: {
    name: string;
    email: string;
    date: string;
  };
  htmlUrl: string;
}

export interface Repository {
  id: string;
  githubId: number;
  owner: string;
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  hasUnseenUpdates: boolean;
  createdAt: string;
  updatedAt: string;
  latestRelease: Release | null;
}
