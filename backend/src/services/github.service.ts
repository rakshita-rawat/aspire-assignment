import { Octokit } from "@octokit/rest";
import {
  GitHubRepository,
  GitHubRelease,
  GitHubCommit,
} from "../types/github.types";
import { NotFoundError, ExternalServiceError } from "../errors/app.errors";
import { logger } from "../utils/logger";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export type { GitHubRepository, GitHubRelease, GitHubCommit };

export class GitHubService {
  static parseRepositoryUrl(
    url: string
  ): { owner: string; repo: string } | null {
    const patterns = [
      /github\.com\/([^\/]+)\/([^\/]+)(?:\.git)?(?:\/)?$/,
      /^([^\/]+)\/([^\/]+)$/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return {
          owner: match[1],
          repo: match[2].replace(/\.git$/, ""),
        };
      }
    }

    return null;
  }

  static async getRepository(
    owner: string,
    repo: string
  ): Promise<GitHubRepository> {
    try {
      const { data } = await octokit.repos.get({
        owner,
        repo,
      });

      return {
        id: data.id,
        name: data.name,
        full_name: data.full_name,
        description: data.description,
        html_url: data.html_url,
        owner: {
          login: data.owner.login,
        },
      };
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "status" in error &&
        error.status === 404
      ) {
        throw new NotFoundError("Repository", `${owner}/${repo}`);
      }
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to fetch repository from GitHub", {
        owner,
        repo,
        error: errorMessage,
      });
      throw new ExternalServiceError(
        "GitHub",
        errorMessage,
        error instanceof Error ? error : undefined
      );
    }
  }

  static async getLatestRelease(
    owner: string,
    repo: string
  ): Promise<GitHubRelease | null> {
    try {
      const { data } = await octokit.repos.getLatestRelease({
        owner,
        repo,
      });

      return {
        id: data.id,
        tag_name: data.tag_name,
        name: data.name,
        published_at: data.published_at!,
        body: data.body,
        html_url: data.html_url,
      };
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "status" in error &&
        error.status === 404
      ) {
        return null;
      }
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to fetch release from GitHub", {
        owner,
        repo,
        error: errorMessage,
      });
      throw new ExternalServiceError(
        "GitHub",
        errorMessage,
        error instanceof Error ? error : undefined
      );
    }
  }

  static async getReleaseCommits(
    owner: string,
    repo: string,
    tag: string
  ): Promise<GitHubCommit[]> {
    try {
      const { data: tagData } = await octokit.git.getRef({
        owner,
        repo,
        ref: `tags/${tag}`,
      });

      const commitSha = tagData.object.sha;

      const { data: commits } = await octokit.repos.listCommits({
        owner,
        repo,
        sha: commitSha,
        per_page: 50,
      });

      return commits.map(
        (commit: {
          sha: string;
          commit: {
            message: string;
            author?: { name?: string; email?: string; date?: string } | null;
          };
          html_url: string;
        }) => ({
          sha: commit.sha.substring(0, 7),
          message: commit.commit.message.split("\n")[0],
          author: {
            name: commit.commit.author?.name || "Unknown",
            email: commit.commit.author?.email || "",
            date: commit.commit.author?.date || "",
          },
          html_url: commit.html_url,
        })
      );
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "status" in error &&
        error.status === 404
      ) {
        return [];
      }
      return [];
    }
  }
}
