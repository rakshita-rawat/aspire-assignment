export interface Release {
  id: number;
  repository_id: number;
  github_release_id: number;
  tag_name: string;
  name: string | null;
  published_at: Date;
  body: string | null;
  html_url: string;
  created_at: Date;
  updated_at: Date;
}
