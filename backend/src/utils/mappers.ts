import { GraphQLRepository, GraphQLRelease } from "../types/graphql.types";
import { Repository } from "../types/repository.types";
import { Release } from "../types/release.types";

export function mapRepositoryToGraphQL(
  repo: Repository
): Omit<GraphQLRepository, "latestRelease" | "hasUnseenUpdates"> {
  return {
    id: repo.id.toString(),
    githubId: repo.github_id,
    owner: repo.owner,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    htmlUrl: repo.html_url,
    createdAt: repo.created_at.toISOString(),
    updatedAt: repo.updated_at.toISOString(),
  };
}

export function mapReleaseToGraphQL(
  release: Release,
  isSeen: boolean
): GraphQLRelease {
  return {
    id: release.id.toString(),
    repositoryId: release.repository_id.toString(),
    githubReleaseId: release.github_release_id,
    tagName: release.tag_name,
    name: release.name,
    publishedAt: release.published_at.toISOString(),
    body: release.body,
    htmlUrl: release.html_url,
    isSeen,
    createdAt: release.created_at.toISOString(),
    updatedAt: release.updated_at.toISOString(),
  };
}
