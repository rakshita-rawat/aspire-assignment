import { GitHubService } from "./github.service";
import {
  GitHubRepository,
  GitHubRelease,
  GitHubCommit,
} from "../types/github.types";
import { MockDataService } from "./mock-data.service";

const USE_MOCK_DATA = process.env.USE_MOCK_DATA === "true";

export class RepositoryDataService {
  static parseRepositoryUrl(
    url: string
  ): { owner: string; repo: string } | null {
    return GitHubService.parseRepositoryUrl(url);
  }

  static async getRepository(
    owner: string,
    repo: string
  ): Promise<GitHubRepository> {
    if (USE_MOCK_DATA) {
      const mockRepo = MockDataService.getRepositoryByOwnerAndName(owner, repo);
      if (mockRepo) {
        return {
          id: mockRepo.github_id,
          name: mockRepo.name,
          full_name: mockRepo.full_name,
          description: mockRepo.description,
          html_url: mockRepo.html_url,
          owner: {
            login: mockRepo.owner,
          },
        };
      }
      const newMockRepo = MockDataService.createRepository(owner, repo);
      return {
        id: newMockRepo.github_id,
        name: newMockRepo.name,
        full_name: newMockRepo.full_name,
        description: newMockRepo.description,
        html_url: newMockRepo.html_url,
        owner: {
          login: newMockRepo.owner,
        },
      };
    }
    return GitHubService.getRepository(owner, repo);
  }

  static async getLatestRelease(
    owner: string,
    repo: string
  ): Promise<GitHubRelease | null> {
    if (USE_MOCK_DATA) {
      const mockRepo = MockDataService.getRepositoryByOwnerAndName(owner, repo);
      if (!mockRepo) {
        return null;
      }
      const mockRelease = MockDataService.getLatestReleaseByRepositoryId(
        mockRepo.id
      );
      if (!mockRelease) {
        return null;
      }
      return {
        id: mockRelease.github_release_id,
        tag_name: mockRelease.tag_name,
        name: mockRelease.name,
        published_at: mockRelease.published_at.toISOString(),
        body: mockRelease.body,
        html_url: mockRelease.html_url,
      };
    }
    return GitHubService.getLatestRelease(owner, repo);
  }

  static async getReleaseCommits(
    owner: string,
    repo: string,
    tag: string
  ): Promise<GitHubCommit[]> {
    if (USE_MOCK_DATA) {
      const mockRepo = MockDataService.getRepositoryByOwnerAndName(owner, repo);
      if (!mockRepo) {
        return [];
      }
      const mockCommits = MockDataService.getReleaseCommits(mockRepo.id, tag);
      return mockCommits.map((c) => ({
        sha: c.sha,
        message: c.message,
        author: {
          name: c.author.name,
          email: c.author.email,
          date: c.author.date,
        },
        html_url: c.html_url,
      }));
    }
    return GitHubService.getReleaseCommits(owner, repo, tag);
  }
}
