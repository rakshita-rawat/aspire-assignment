import {
  RepositoryModel,
  ReleaseModel,
  SeenStatusModel,
} from "../models/repository.model";
import { RepositoryDataService } from "./repository-data.service";
import { NotFoundError } from "../errors/app.errors";
import { validateRepositoryUrl, validateId } from "../utils/validation";
import { GraphQLRepository } from "../types/graphql.types";
import { Repository } from "../types/repository.types";
import { mapRepositoryToGraphQL, mapReleaseToGraphQL } from "../utils/mappers";

async function getRepositoryWithRelease(
  repo: Repository
): Promise<GraphQLRepository> {
  const latestRelease = await ReleaseModel.getLatestByRepositoryId(repo.id);
  const isSeen = latestRelease
    ? await SeenStatusModel.isSeen(repo.id, latestRelease.id)
    : false;
  const hasUnseenUpdates = latestRelease ? !isSeen : false;

  return {
    ...mapRepositoryToGraphQL(repo),
    latestRelease: latestRelease
      ? mapReleaseToGraphQL(latestRelease, isSeen)
      : null,
    hasUnseenUpdates,
  };
}

export class RepositoryService {
  static async getAllRepositories(): Promise<GraphQLRepository[]> {
    const repos = await RepositoryModel.findAll();
    return Promise.all(repos.map(getRepositoryWithRelease));
  }

  static async getRepositoryById(
    id: string
  ): Promise<GraphQLRepository | null> {
    const numId = validateId(id, "Repository");
    const repo = await RepositoryModel.findById(numId);
    if (!repo) {
      return null;
    }
    return getRepositoryWithRelease(repo);
  }

  static async addRepository(url: string): Promise<GraphQLRepository> {
    validateRepositoryUrl(url);
    const repo = await RepositoryModel.create(url);
    const latestRelease = await ReleaseModel.getLatestByRepositoryId(repo.id);

    return {
      ...mapRepositoryToGraphQL(repo),
      latestRelease: latestRelease
        ? mapReleaseToGraphQL(latestRelease, false)
        : null,
      hasUnseenUpdates: latestRelease !== null,
    };
  }

  static async deleteRepository(id: string): Promise<boolean> {
    const numId = validateId(id, "Repository");
    return await RepositoryModel.delete(numId);
  }

  static async refreshRepository(id: string): Promise<GraphQLRepository> {
    const numId = validateId(id, "Repository");
    const repo = await RepositoryModel.refresh(numId);
    return getRepositoryWithRelease(repo);
  }

  static async refreshAllRepositories(): Promise<void> {
    await RepositoryModel.refreshAll();
  }

  static async markReleaseAsSeen(
    repositoryId: string,
    releaseId: string
  ): Promise<void> {
    const repoId = validateId(repositoryId, "Repository");
    const relId = validateId(releaseId, "Release");
    await SeenStatusModel.markAsSeen(repoId, relId);
  }
}
