import { PR } from "../";
declare function postNewPrForProject(project_uuid: string, pr: Partial<PR>): Promise<any>;
export { postNewPrForProject };
