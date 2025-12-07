export interface Repository {
  id: number;
  github_id: number;
  owner: string;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  created_at: Date;
  updated_at: Date;
}
