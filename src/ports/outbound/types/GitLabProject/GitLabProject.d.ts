export interface GitLabProject {
  id: number;
  description?: null;
  name: string;
  name_with_namespace: string;
  path: string;
  path_with_namespace: string;
  created_at: string;
  default_branch: string;
  tag_list?: (null)[] | null;
  ssh_url_to_repo: string;
  http_url_to_repo: string;
  web_url: string;
  avatar_url?: null;
  star_count: number;
  forks_count: number;
  last_activity_at: string;
  _links: Links;
  archived: boolean;
  visibility: string;
  owner: Owner;
  resolve_outdated_diff_discussions: boolean;
  container_registry_enabled: boolean;
  issues_enabled: boolean;
  merge_requests_enabled: boolean;
  wiki_enabled: boolean;
  jobs_enabled: boolean;
  snippets_enabled: boolean;
  shared_runners_enabled: boolean;
  lfs_enabled: boolean;
  creator_id: number;
  namespace: Namespace;
  import_status: string;
  import_error?: null;
  open_issues_count: number;
  runners_token: string;
  public_jobs: boolean;
  ci_config_path?: null;
  shared_with_groups?: (null)[] | null;
  only_allow_merge_if_pipeline_succeeds: boolean;
  request_access_enabled: boolean;
  only_allow_merge_if_all_discussions_are_resolved: boolean;
  printing_merge_request_link_enabled: boolean;
  merge_method: string;
  permissions: Permissions;
}
export interface Links {
  self: string;
  issues: string;
  merge_requests: string;
  repo_branches: string;
  labels: string;
  events: string;
  members: string;
}
export interface Owner {
  id: number;
  name: string;
  username: string;
  state: string;
  avatar_url: string;
  web_url: string;
}
export interface Namespace {
  id: number;
  name: string;
  path: string;
  kind: string;
  full_path: string;
  parent_id?: null;
}
export interface Permissions {
  project_access: ProjectAccess;
  group_access?: null;
}
export interface ProjectAccess {
  access_level: number;
  notification_level: number;
}
