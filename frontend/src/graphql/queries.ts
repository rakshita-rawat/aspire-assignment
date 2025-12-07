import { gql } from "@apollo/client";

export const GET_REPOSITORIES = gql`
  query GetRepositories {
    repositories {
      id
      githubId
      owner
      name
      fullName
      description
      htmlUrl
      hasUnseenUpdates
      createdAt
      updatedAt
      latestRelease {
        id
        repositoryId
        githubReleaseId
        tagName
        name
        publishedAt
        body
        htmlUrl
        isSeen
        createdAt
        updatedAt
      }
    }
  }
`;

export const ADD_REPOSITORY = gql`
  mutation AddRepository($url: String!) {
    addRepository(url: $url) {
      id
      githubId
      owner
      name
      fullName
      description
      htmlUrl
      hasUnseenUpdates
      createdAt
      updatedAt
      latestRelease {
        id
        repositoryId
        githubReleaseId
        tagName
        name
        publishedAt
        body
        htmlUrl
        isSeen
        createdAt
        updatedAt
      }
    }
  }
`;

export const DELETE_REPOSITORY = gql`
  mutation DeleteRepository($id: ID!) {
    deleteRepository(id: $id)
  }
`;

export const REFRESH_REPOSITORY = gql`
  mutation RefreshRepository($id: ID!) {
    refreshRepository(id: $id) {
      id
      githubId
      owner
      name
      fullName
      description
      htmlUrl
      hasUnseenUpdates
      createdAt
      updatedAt
      latestRelease {
        id
        repositoryId
        githubReleaseId
        tagName
        name
        publishedAt
        body
        htmlUrl
        isSeen
        createdAt
        updatedAt
      }
    }
  }
`;

export const REFRESH_ALL_REPOSITORIES = gql`
  mutation RefreshAllRepositories {
    refreshAllRepositories
  }
`;

export const MARK_RELEASE_AS_SEEN = gql`
  mutation MarkReleaseAsSeen($repositoryId: ID!, $releaseId: ID!) {
    markReleaseAsSeen(repositoryId: $repositoryId, releaseId: $releaseId)
  }
`;

export const GET_RELEASE_DETAILS = gql`
  query GetReleaseDetails($repositoryId: ID!, $releaseId: ID!) {
    releaseDetails(repositoryId: $repositoryId, releaseId: $releaseId) {
      release {
        id
        repositoryId
        githubReleaseId
        tagName
        name
        publishedAt
        body
        htmlUrl
        isSeen
        createdAt
        updatedAt
      }
      commits {
        sha
        message
        author {
          name
          email
          date
        }
        htmlUrl
      }
    }
  }
`;
