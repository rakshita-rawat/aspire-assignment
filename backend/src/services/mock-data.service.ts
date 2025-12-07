import { MockRepository, MockRelease, MockCommit } from "../types/mock.types";

export type { MockRepository, MockRelease, MockCommit };

export class MockDataService {
  private static mockRepositories: MockRepository[] = [
    {
      id: 1,
      github_id: 10270250,
      owner: "facebook",
      name: "react",
      full_name: "facebook/react",
      description: "The library for web and native user interfaces",
      html_url: "https://github.com/facebook/react",
      created_at: new Date("2024-01-15"),
      updated_at: new Date("2024-12-05"),
    },
    {
      id: 2,
      github_id: 70107786,
      owner: "vercel",
      name: "next.js",
      full_name: "vercel/next.js",
      description: "The React Framework for Production",
      html_url: "https://github.com/vercel/next.js",
      created_at: new Date("2024-02-20"),
      updated_at: new Date("2024-12-04"),
    },
    {
      id: 3,
      github_id: 11730342,
      owner: "vuejs",
      name: "vue",
      full_name: "vuejs/vue",
      description:
        "This is the repo for Vue 2. For Vue 3, go to https://github.com/vuejs/core",
      html_url: "https://github.com/vuejs/vue",
      created_at: new Date("2024-03-10"),
      updated_at: new Date("2024-12-03"),
    },
  ];

  private static mockReleases: MockRelease[] = [
    {
      id: 1,
      repository_id: 1,
      github_release_id: 12345678,
      tag_name: "v18.2.0",
      name: "React 18.2.0",
      published_at: new Date("2024-11-20"),
      body: "## What's Changed\n\n* Improved performance with concurrent rendering\n* New hooks and features\n* Bug fixes and improvements",
      html_url: "https://github.com/facebook/react/releases/tag/v18.2.0",
      created_at: new Date("2024-11-20"),
      updated_at: new Date("2024-11-20"),
    },
    {
      id: 2,
      repository_id: 2,
      github_release_id: 12345679,
      tag_name: "v14.1.0",
      name: "Next.js 14.1.0",
      published_at: new Date("2024-11-25"),
      body: "## Highlights\n\n* Improved App Router performance\n* New middleware features\n* Enhanced developer experience",
      html_url: "https://github.com/vercel/next.js/releases/tag/v14.1.0",
      created_at: new Date("2024-11-25"),
      updated_at: new Date("2024-11-25"),
    },
    {
      id: 3,
      repository_id: 3,
      github_release_id: 12345680,
      tag_name: "v2.7.16",
      name: "Vue 2.7.16",
      published_at: new Date("2024-11-28"),
      body: "## Bug Fixes\n\n* Fixed memory leaks\n* Improved TypeScript support\n* Security updates",
      html_url: "https://github.com/vuejs/vue/releases/tag/v2.7.16",
      created_at: new Date("2024-11-28"),
      updated_at: new Date("2024-11-28"),
    },
  ];

  static getRepositoryByOwnerAndName(
    owner: string,
    name: string
  ): MockRepository | null {
    return (
      this.mockRepositories.find((r) => r.owner === owner && r.name === name) ||
      null
    );
  }

  static getLatestReleaseByRepositoryId(
    repositoryId: number
  ): MockRelease | null {
    return (
      this.mockReleases.find((r) => r.repository_id === repositoryId) || null
    );
  }

  static createRepository(owner: string, name: string): MockRepository {
    const newRepo: MockRepository = {
      id: this.mockRepositories.length + 1,
      github_id: 10000000 + this.mockRepositories.length + 1,
      owner,
      name,
      full_name: `${owner}/${name}`,
      description: `Mock repository: ${owner}/${name}`,
      html_url: `https://github.com/${owner}/${name}`,
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.mockRepositories.push(newRepo);
    return newRepo;
  }

  static deleteRepository(id: number): boolean {
    const index = this.mockRepositories.findIndex((r) => r.id === id);
    if (index !== -1) {
      this.mockRepositories.splice(index, 1);
      // Also remove associated releases
      this.mockReleases = this.mockReleases.filter(
        (r) => r.repository_id !== id
      );
      return true;
    }
    return false;
  }

  static getReleaseCommits(): MockCommit[] {
    // Return mock commits for the release
    return [
      {
        sha: "a1b2c3d",
        message: "Fix critical bug in rendering",
        author: {
          name: "John Doe",
          email: "john@example.com",
          date: new Date("2024-11-19").toISOString(),
        },
        html_url: `https://github.com/mock/repo/commit/a1b2c3d`,
      },
      {
        sha: "e4f5g6h",
        message: "Add new feature for better performance",
        author: {
          name: "Jane Smith",
          email: "jane@example.com",
          date: new Date("2024-11-18").toISOString(),
        },
        html_url: `https://github.com/mock/repo/commit/e4f5g6h`,
      },
      {
        sha: "i7j8k9l",
        message: "Update dependencies",
        author: {
          name: "Bob Wilson",
          email: "bob@example.com",
          date: new Date("2024-11-17").toISOString(),
        },
        html_url: `https://github.com/mock/repo/commit/i7j8k9l`,
      },
    ];
  }
}
