import axios from "axios";
import {hubClientConfig, Event, PR} from "../";

async function updatePrOfProject(project_uuid: string, pr_id: string, status: 'open' | 'closed' | 'merged', assignee?: {id: number, username: string}): Promise<any> {
    let {data} = await axios.post(hubClientConfig.c3pr.hub.prOfProjectUrl(project_uuid, pr_id), {status, assignee}, {headers: hubClientConfig.headers()});
    return data;
}

export { updatePrOfProject }