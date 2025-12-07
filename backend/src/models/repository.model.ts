import { query } from "../utils/database";
import { RepositoryDataService } from "../services/repository-data.service";
import { GitHubRelease } from "../types/github.types";
import { Repository } from "../types/repository.types";
import { Release } from "../types/release.types";
import { SeenStatus } from "../types/seen-status.types";
import { logger } from "../utils/logger";
import { ValidationError, NotFoundError } from "../errors/app.errors";

export type { Repository, Release, SeenStatus };

export class RepositoryModel {
  static async create(repoUrl: string): Promise<Repository> {
    const parsed = RepositoryDataService.parseRepositoryUrl(repoUrl);
    if (!parsed) {
      throw new ValidationError("Invalid GitHub repository URL", "url");
    }

    // Check if repository already exists
    const existing = await this.findByOwnerAndName(parsed.owner, parsed.repo);
    if (existing) {
      throw new ValidationError("Repository is already being tracked", "url");
    }

    const githubRepo = await RepositoryDataService.getRepository(
      parsed.owner,
      parsed.repo
    );
    const latestRelease = await RepositoryDataService.getLatestRelease(
      parsed.owner,
      parsed.repo
    );

    const repoResult = await query(
      `INSERT INTO repositories (github_id, owner, name, full_name, description, html_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        githubRepo.id,
        parsed.owner,
        parsed.repo,
        githubRepo.full_name,
        githubRepo.description,
        githubRepo.html_url,
      ]
    );

    const repository = repoResult.rows[0] as Repository;

    if (latestRelease) {
      await ReleaseModel.create(repository.id, latestRelease);
    }

    return repository;
  }

  static async findByOwnerAndName(
    owner: string,
    name: string
  ): Promise<Repository | null> {
    const result = await query(
      "SELECT * FROM repositories WHERE owner = $1 AND name = $2",
      [owner, name]
    );
    return result.rows[0] || null;
  }

  static async findAll(): Promise<Repository[]> {
    const result = await query(
      "SELECT * FROM repositories ORDER BY created_at DESC"
    );
    return result.rows;
  }

  static async findById(id: number): Promise<Repository | null> {
    const result = await query("SELECT * FROM repositories WHERE id = $1", [
      id,
    ]);
    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await query("DELETE FROM repositories WHERE id = $1", [id]);
    return (result.rowCount || 0) > 0;
  }

  static async refresh(id: number): Promise<Repository> {
    const repo = await this.findById(id);
    if (!repo) {
      throw new NotFoundError("Repository", id);
    }

    const githubRepo = await RepositoryDataService.getRepository(
      repo.owner,
      repo.name
    );
    const latestRelease = await RepositoryDataService.getLatestRelease(
      repo.owner,
      repo.name
    );

    // Update repository info
    await query(
      `UPDATE repositories 
       SET description = $1, updated_at = NOW()
       WHERE id = $2`,
      [githubRepo.description, id]
    );

    if (latestRelease) {
      const existingRelease = await ReleaseModel.findByGithubReleaseId(
        latestRelease.id
      );
      if (!existingRelease) {
        await ReleaseModel.create(id, latestRelease);
      }
    }

    const updated = await this.findById(id);
    return updated!;
  }

  static async refreshAll(): Promise<void> {
    const repositories = await this.findAll();
    for (const repo of repositories) {
      try {
        await this.refresh(repo.id);
      } catch (error) {
        logger.error(`Failed to refresh ${repo.full_name}`, error, {
          repositoryId: repo.id,
        });
      }
    }
  }
}

export class ReleaseModel {
  static async findById(id: number): Promise<Release | null> {
    const result = await query("SELECT * FROM releases WHERE id = $1", [id]);
    return result.rows[0] || null;
  }

  static async create(
    repositoryId: number,
    githubRelease: GitHubRelease
  ): Promise<Release> {
    const result = await query(
      `INSERT INTO releases (repository_id, github_release_id, tag_name, name, published_at, body, html_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        repositoryId,
        githubRelease.id,
        githubRelease.tag_name,
        githubRelease.name,
        githubRelease.published_at,
        githubRelease.body,
        githubRelease.html_url,
      ]
    );
    return result.rows[0] as Release;
  }

  static async getLatestByRepositoryId(
    repositoryId: number
  ): Promise<Release | null> {
    const result = await query(
      `SELECT * FROM releases 
       WHERE repository_id = $1 
       ORDER BY published_at DESC 
       LIMIT 1`,
      [repositoryId]
    );
    return result.rows[0] || null;
  }

  static async findByGithubReleaseId(
    githubReleaseId: number
  ): Promise<Release | null> {
    const result = await query(
      "SELECT * FROM releases WHERE github_release_id = $1",
      [githubReleaseId]
    );
    return result.rows[0] || null;
  }
}

export class SeenStatusModel {
  static async markAsSeen(
    repositoryId: number,
    releaseId: number
  ): Promise<SeenStatus> {
    const existing = await query(
      "SELECT * FROM seen_status WHERE repository_id = $1 AND release_id = $2",
      [repositoryId, releaseId]
    );

    if (existing.rows.length > 0) {
      const result = await query(
        `UPDATE seen_status SET seen_at = NOW() 
         WHERE repository_id = $1 AND release_id = $2 
         RETURNING *`,
        [repositoryId, releaseId]
      );
      return result.rows[0] as SeenStatus;
    } else {
      const result = await query(
        `INSERT INTO seen_status (repository_id, release_id, seen_at)
         VALUES ($1, $2, NOW())
         RETURNING *`,
        [repositoryId, releaseId]
      );
      return result.rows[0] as SeenStatus;
    }
  }

  static async isSeen(
    repositoryId: number,
    releaseId: number
  ): Promise<boolean> {
    const result = await query(
      "SELECT * FROM seen_status WHERE repository_id = $1 AND release_id = $2",
      [repositoryId, releaseId]
    );
    return result.rows.length > 0;
  }
}
