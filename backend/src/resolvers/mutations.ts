import { ResolverParent, GraphQLRepository } from "../types/graphql.types";
import { RepositoryService } from "../services/repository.service";

export const mutations = {
  addRepository: async (
    _: ResolverParent,
    { url }: { url: string }
  ): Promise<GraphQLRepository> => {
    return RepositoryService.addRepository(url);
  },

  deleteRepository: async (
    _: ResolverParent,
    { id }: { id: string }
  ): Promise<boolean> => {
    return RepositoryService.deleteRepository(id);
  },

  refreshRepository: async (
    _: ResolverParent,
    { id }: { id: string }
  ): Promise<GraphQLRepository> => {
    return RepositoryService.refreshRepository(id);
  },

  refreshAllRepositories: async (): Promise<boolean> => {
    await RepositoryService.refreshAllRepositories();
    return true;
  },

  markReleaseAsSeen: async (
    _: ResolverParent,
    { repositoryId, releaseId }: { repositoryId: string; releaseId: string }
  ): Promise<boolean> => {
    await RepositoryService.markReleaseAsSeen(repositoryId, releaseId);
    return true;
  },
};

