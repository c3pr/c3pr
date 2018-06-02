import axios from "axios";
import {HubClient} from "../types/HubClient";
import hubClientConfig from "../hubClientConfig";

async function fetchProjectUuidForCloneUrl(clone_url_http: string): Promise<string> {
    const headers = {Authorization: `Bearer ${hubClientConfig.c3pr.hub.auth.jwt}`};

    const {data} = await axios.get(hubClientConfig.c3pr.hub.projectsByCloneUrlHttp(clone_url_http), {headers});
    if (!data.length) {
        throw new Error('Project with URL ' + clone_url_http + ' not found.');
    }
    const [{uuid: project_uuid}] = data;
    return project_uuid;
}

// noinspection JSUnusedLocalSymbols
const variableToGuaranteeTheFunctionMatchesTheInterface: HubClient['fetchProjectUuidForCloneUrl'] = fetchProjectUuidForCloneUrl;

export { fetchProjectUuidForCloneUrl }