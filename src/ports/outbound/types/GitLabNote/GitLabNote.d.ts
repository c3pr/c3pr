export interface GitLabNote {
    object_kind: string;
    event_type: string;
    user: User;
    project_id: number;
    project: Project;
    object_attributes: ObjectAttributes;
    repository: Repository;
    merge_request: MergeRequest;
}


export interface User {
    name: string;
    username: string;
    avatar_url: string;
}

export interface Project {
    id: number;
    name: string;
    description?: any;
    web_url: string;
    avatar_url?: any;
    git_ssh_url: string;
    git_http_url: string;
    namespace: string;
    visibility_level: number;
    path_with_namespace: string;
    default_branch: string;
    ci_config_path?: any;
    homepage: string;
    url: string;
    ssh_url: string;
    http_url: string;
}

export interface ObjectAttributes {
    id: number;
    note: string;
    noteable_type: string;
    author_id: number;
    created_at: string;
    updated_at: string;
    project_id: number;
    attachment?: any;
    line_code?: any;
    commit_id?: any;
    noteable_id: number;
    system: boolean;
    st_diff?: any;
    updated_by_id?: any;
    type?: any;
    position?: any;
    original_position?: any;
    resolved_at?: any;
    resolved_by_id?: any;
    discussion_id: string;
    change_position?: any;
    resolved_by_push?: any;
    url: string;
}

export interface Repository {
    name: string;
    url: string;
    description?: any;
    homepage: string;
}

export interface MergeParams {
    force_remove_source_branch?: any;
}

export interface Source {
    id: number;
    name: string;
    description?: any;
    web_url: string;
    avatar_url?: any;
    git_ssh_url: string;
    git_http_url: string;
    namespace: string;
    visibility_level: number;
    path_with_namespace: string;
    default_branch: string;
    ci_config_path?: any;
    homepage: string;
    url: string;
    ssh_url: string;
    http_url: string;
}

export interface Target {
    id: number;
    name: string;
    description?: any;
    web_url: string;
    avatar_url?: any;
    git_ssh_url: string;
    git_http_url: string;
    namespace: string;
    visibility_level: number;
    path_with_namespace: string;
    default_branch: string;
    ci_config_path?: any;
    homepage: string;
    url: string;
    ssh_url: string;
    http_url: string;
}

export interface Author {
    name: string;
    email: string;
}

export interface LastCommit {
    id: string;
    message: string;
    timestamp: Date;
    url: string;
    author: Author;
}

export interface MergeRequest {
    assignee_id: number;
    author_id: number;
    created_at: string;
    description: string;
    head_pipeline_id?: any;
    id: number;
    iid: number;
    last_edited_at?: any;
    last_edited_by_id?: any;
    merge_commit_sha?: any;
    merge_error?: any;
    merge_params: MergeParams;
    merge_status: string;
    merge_user_id?: any;
    merge_when_pipeline_succeeds: boolean;
    milestone_id?: any;
    source_branch: string;
    source_project_id: number;
    state: string;
    target_branch: string;
    target_project_id: number;
    time_estimate: number;
    title: string;
    updated_at: string;
    updated_by_id?: any;
    url: string;
    source: Source;
    target: Target;
    last_commit: LastCommit;
    work_in_progress: boolean;
    total_time_spent: number;
    human_total_time_spent?: any;
    human_time_estimate?: any;
}

