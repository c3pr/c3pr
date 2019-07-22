import axios from 'axios';
import axiosRetry from 'axios-retry/lib';
import uuidv4 from "uuid/v4";

export interface CommandEvent {
    event_type: string;
    project_clone_http_url: string;
    commit_hash?: string;
    // will be generated -> uuid: string;
    // will be generated -> timestamp: string;
    command: string;
    args: {[s: string]: any};
    meta?: any;
}

export interface Config {
    c3prHubUrl: string;
    jwt: string;
    retryWait?: number;
}

export default async function produceCommandEvent(event: CommandEvent, config: Config, c3prLOG5) {
    const event_type = event.event_type;
    const {c3prHubUrl, jwt, retryWait = 2000} = config;

    // we dont use spread because we care about the order and not adding extra props
    const payload = {
        event_type,
        project_clone_http_url: event.project_clone_http_url,
        commit_hash: event.commit_hash,
        uuid: uuid(),
        timestamp: timestamp(),
        command: event.command,
        args: event.args,
        meta: event.meta
    };

    try {
        c3prLOG5(`Registering new event for type '${event_type}'.`, {meta: {payload}});
        const client = axios.create({ baseURL: c3prHubUrl });

        axiosRetry(client, { retries: 3, retryDelay: retryCount => retryCount * retryWait });

        const headers = {Authorization: `Bearer ${jwt}`};
        await client.post(`/api/v1/events/${event_type}`, payload, {headers});
    } catch (error) {
        c3prLOG5(`Error while registering new event of type '${event_type}'.`, {error, meta: {payload}});
        throw error;
    }
}



function timestamp() {
    return new Date().toISOString();
}

function uuid() {
    return uuidv4();
}