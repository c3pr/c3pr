import axios from "axios";
import config from "../../config";
import {Ports} from "../types/Ports";

async function fetchProjectUuidForCloneUrl(clone_url_http: string): Promise<string> {
    const headers = {Authorization: `Bearer ${config.c3pr.hub.auth.jwt}`};

    const {data} = await axios.get(config.c3pr.hub.projectsByCloneUrlHttp(clone_url_http), {headers});
    if (!data.length) {
        throw new Error('Project with URL ' + clone_url_http + ' not found.');
    }
    const [{uuid: project_uuid}] = data;
    return project_uuid;
}

export let _fetchProjectUuidForCloneUrl: Ports['fetchProjectUuidForCloneUrl'] = fetchProjectUuidForCloneUrl;