export interface GitLabCommit {
  id: string;
  short_id: string;
  title: string;
  created_at: string;
  parent_ids?: (string)[] | null;
  message: string;
  author_name: string;
  author_email: string;
  authored_date: string;
  committer_name: string;
  committer_email: string;
  committed_date: string;
  stats: Stats;
  status?: null;
  last_pipeline?: null;
  project_id: number;
}
export interface Stats {
  additions: number;
  deletions: number;
  total: number;
}
