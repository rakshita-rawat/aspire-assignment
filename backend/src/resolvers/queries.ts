import {
  ResolverParent,
  GraphQLRepository,
  GraphQLReleaseDetails,
} from "../types/graphql.types";
import { RepositoryService } from "../services/repository.service";
import {
  ReleaseModel,
  RepositoryModel,
  SeenStatusModel,
} from "../models/repository.model";
import { RepositoryDataService } from "../services/repository-data.service";
import { NotFoundError } from "../errors/app.errors";
import { validateId } from "../utils/validation";
import { mapReleaseToGraphQL } from "../utils/mappers";

export const queries = {
  repositories: async (): Promise<GraphQLRepository[]> => {
    return RepositoryService.getAllRepositories();
  },

  repository: async (
    _: ResolverParent,
    { id }: { id: string }
  ): Promise<GraphQLRepository | null> => {
    return RepositoryService.getRepositoryById(id);
  },

  releaseDetails: async (
    _: ResolverParent,
    { repositoryId, releaseId }: { repositoryId: string; releaseId: string }
  ): Promise<GraphQLReleaseDetails> => {
    const repoId = validateId(repositoryId, "Repository");
    const relId = validateId(releaseId, "Release");

    const repo = await RepositoryModel.findById(repoId);
    if (!repo) {
      throw new NotFoundError("Repository", repositoryId);
    }

    const release = await ReleaseModel.findById(relId);
    if (!release || release.repository_id !== repoId) {
      throw new NotFoundError("Release", releaseId);
    }

    const isSeen = await SeenStatusModel.isSeen(repoId, relId);
    const mappedRelease = mapReleaseToGraphQL(release, isSeen);

    const commits = await RepositoryDataService.getReleaseCommits(
      repo.owner,
      repo.name,
      release.tag_name
    );

    return {
      release: mappedRelease,
      commits: commits.map((commit) => ({
        sha: commit.sha,
        message: commit.message,
        author: {
          name: commit.author.name,
          email: commit.author.email,
          date: commit.author.date,
        },
        htmlUrl: commit.html_url,
      })),
    };
  },
};
