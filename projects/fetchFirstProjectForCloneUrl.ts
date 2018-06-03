import axios from "axios";
import {hubClientConfig} from "../";

async function fetchFirstProjectForCloneUrl(clone_url_http: string): Promise<string> {
    const {data} = await axios.get(hubClientConfig.c3pr.hub.projectsByCloneUrlHttp(clone_url_http), {headers: hubClientConfig.headers()});
    if (!data.length) {
        throw new Error('Project with URL ' + clone_url_http + ' not found.');
    }
    const [{uuid: project_uuid}] = data;
    return project_uuid;
}

export { fetchFirstProjectForCloneUrl }