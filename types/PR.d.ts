export interface PR {
    project_uuid: string;
    pr_id: number;
    pr_url: string;
    PullRequestRequested: string;
    changed_files: string[];
    status: 'OPEN' | 'CLOSED' | 'MERGED',
    comments_count: { [username: string]: number }
}