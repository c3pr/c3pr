import axios from "axios";
import {hubClientConfig, Event, PR} from "../";

async function postNewPrForProject(project_uuid: string, pr: PR): Promise<any> {
    let {data} = await axios.post(hubClientConfig.c3pr.hub.prsForProjectUrl(project_uuid), pr, {headers: hubClientConfig.headers()});
    return data;
}

export { postNewPrForProject }