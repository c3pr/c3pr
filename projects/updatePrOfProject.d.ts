declare function updatePrOfProject(project_uuid: string, pr_id: string, status: 'open' | 'closed' | 'merged', assignee?: {
    id: number;
    username: string;
}): Promise<any>;
export { updatePrOfProject };
