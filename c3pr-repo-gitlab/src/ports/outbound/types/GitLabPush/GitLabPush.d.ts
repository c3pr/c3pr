export interface GitLabPush {
  object_kind: string;
  event_name: string;
  before: string;
  after: string;
  ref: string;
  checkout_sha: string;
  message?: null;
  user_id: number;
  user_name: string;
  user_username: string;
  user_email: string;
  user_avatar: string;
  project_id: number;
  project: Project;
  commits?: (Commit)[] | null;
  total_commits_count: number;
  repository: Repository;
}
export interface Project {
  id: number;
  name: string;
  description?: null;
  web_url: string;
  avatar_url?: null;
  git_ssh_url: string;
  git_http_url: string;
  namespace: string;
  visibility_level: number;
  path_with_namespace: string;
  default_branch: string;
  ci_config_path?: null;
  homepage: string;
  url: string;
  ssh_url: string;
  http_url: string;
}
export interface Commit {
  id: string;
  message: string;
  timestamp: string;
  url: string;
  author: Author;
  added?: (string)[] | null;
  modified?: (string | null)[] | null;
  removed?: (string | null)[] | null;
}
export interface Author {
  name: string;
  email: string;
}
export interface Repository {
  name: string;
  url: string;
  description?: null;
  homepage: string;
  git_http_url: string;
  git_ssh_url: string;
  visibility_level: number;
}
