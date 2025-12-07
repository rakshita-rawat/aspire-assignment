import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Repository {
    id: ID!
    githubId: Int!
    owner: String!
    name: String!
    fullName: String!
    description: String
    htmlUrl: String!
    latestRelease: Release
    hasUnseenUpdates: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Release {
    id: ID!
    repositoryId: ID!
    githubReleaseId: Int!
    tagName: String!
    name: String
    publishedAt: String!
    body: String
    htmlUrl: String!
    isSeen: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Commit {
    sha: String!
    message: String!
    author: CommitAuthor!
    htmlUrl: String!
  }

  type CommitAuthor {
    name: String!
    email: String!
    date: String!
  }

  type ReleaseDetails {
    release: Release!
    commits: [Commit!]!
  }

  type Query {
    repositories: [Repository!]!
    repository(id: ID!): Repository
    releaseDetails(repositoryId: ID!, releaseId: ID!): ReleaseDetails
  }

  type Mutation {
    addRepository(url: String!): Repository!
    deleteRepository(id: ID!): Boolean!
    refreshRepository(id: ID!): Repository!
    refreshAllRepositories: Boolean!
    markReleaseAsSeen(repositoryId: ID!, releaseId: ID!): Boolean!
  }
`;
