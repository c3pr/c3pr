export interface GitLabMergeRequestUpdated {
  object_kind: string;
  event_type: string;
  user: CurrentOrUserOrAssignee;
  project: SourceOrTargetOrProject;
  object_attributes: ObjectAttributes;
  labels?: (null)[] | null;
  changes: Changes;
  repository: Repository;
  assignee: CurrentOrUserOrAssignee;
}
export interface CurrentOrUserOrAssignee {
  name: string;
  username: string;
  avatar_url: string;
}
export interface SourceOrTargetOrProject {
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
export interface ObjectAttributes {
  assignee_id: number;
  author_id: number;
  created_at: string;
  description: string;
  head_pipeline_id?: null;
  id: number;
  iid: number;
  last_edited_at?: null;
  last_edited_by_id?: null;
  merge_commit_sha?: null;
  merge_error?: null;
  merge_params: MergeParams;
  merge_status: string;
  merge_user_id?: null;
  merge_when_pipeline_succeeds: boolean;
  milestone_id?: null;
  source_branch: string;
  source_project_id: number;
  state: 'opened' | 'closed' | 'merged';
  target_branch: string;
  target_project_id: number;
  time_estimate: number;
  title: string;
  updated_at: string;
  updated_by_id: number;
  url: string;
  source: SourceOrTargetOrProject;
  target: SourceOrTargetOrProject;
  last_commit: LastCommit;
  work_in_progress: boolean;
  total_time_spent: number;
  human_total_time_spent?: null;
  human_time_estimate?: null;
  action: 'open' | 'merge' | 'reopen' | 'close' | 'update'; // https://gitlab.com/gitlab-org/gitlab-ce/commit/4ffdb83e713b1ffa9578c02d31cfd0d9afe56ca7
}
export interface MergeParams {
  force_remove_source_branch?: null;
}
export interface LastCommit {
  id: string;
  message: string;
  timestamp: string;
  url: string;
  author: Author;
}
export interface Author {
  name: string;
  email: string;
}
export interface Changes {
  state?: StateOrUpdatedAt;
  updated_at: StateOrUpdatedAt;
  total_time_spent?: TotalTimeSpent;
  assignee_id?: AssigneeIdOrUpdatedById;
  updated_by_id?: AssigneeIdOrUpdatedById;
  assignee?: Assignee;
}
export interface StateOrUpdatedAt {
  previous: string;
  current: string;
}
export interface TotalTimeSpent {
  previous?: null;
  current: number;
}
export interface AssigneeIdOrUpdatedById {
  previous?: null;
  current: number;
}
export interface Assignee {
  previous?: null;
  current: CurrentOrUserOrAssignee;
}
export interface Repository {
  name: string;
  url: string;
  description?: null;
  homepage: string;
}
