import { PRStatus } from "../types/PR";
declare function updatePrOfProject(project_uuid: string, pr_id: string, status: PRStatus, assignee?: {
    id: number;
    username: string;
}): Promise<any>;
export { updatePrOfProject };
