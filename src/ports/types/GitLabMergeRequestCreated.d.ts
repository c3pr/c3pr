export interface GitLabMergeRequestCreated {
    id: number;
    iid: number;
    project_id: number;
    title: string;
    description: string;
    state: string;
    created_at: string;
    updated_at: string;
    target_branch: string;
    source_branch: string;
    upvotes: number;
    downvotes: number;
    author: Author;
    assignee?: null;
    source_project_id: number;
    target_project_id: number;
    labels?: (null)[] | null;
    work_in_progress: boolean;
    milestone?: null;
    merge_when_pipeline_succeeds: boolean;
    merge_status: string;
    sha: string;
    merge_commit_sha?: null;
    user_notes_count: number;
    discussion_locked?: null;
    should_remove_source_branch?: null;
    force_remove_source_branch?: null;
    allow_maintainer_to_push: boolean;
    web_url: string;
    time_stats: TimeStats;
    subscribed: boolean;
    changes_count: string;
    merged_by?: null;
    merged_at?: null;
    closed_by?: null;
    closed_at?: null;
    latest_build_started_at?: null;
    latest_build_finished_at?: null;
    first_deployed_to_production_at?: null;
    pipeline?: null;
}
export interface Author {
    id: number;
    name: string;
    username: string;
    state: string;
    avatar_url: string;
    web_url: string;
}
export interface TimeStats {
    time_estimate: number;
    total_time_spent: number;
    human_time_estimate?: null;
    human_total_time_spent?: null;
}
