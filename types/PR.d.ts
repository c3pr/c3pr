export type PRStatus = 'open' | 'closed' | 'merged';

export interface PR {
    project_uuid: string;
    pr_id: number;
    pr_url: string;
    PullRequestRequested: string;
    changed_files: string[];
    status: PRStatus,
    comments_count: { [username: string]: number },
    assignee: {id: number, username: string}
}