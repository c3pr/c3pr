import axios from 'axios';
import axiosRetry from 'axios-retry';
import c3prLOG5 from "node-c3pr-logger/c3prLOG5";


function generateLogFunction(__c3prLOG5, outerLCID: any, outerSHA: any, outerEUUID: any) {
    if (__c3prLOG5) {
        return __c3prLOG5;
    }
    return c3prLOG5({lcid: outerLCID, sha: outerSHA || '!register-newfirst-event', ...(outerEUUID && {euuid: outerEUUID})});
}

interface NewEventArgs {
    event_type: string;
    payload;
    c3prHubUrl: string;
    jwt: string;
    lcid?: string;
    sha?: string;
    euuid?: string;
    retryWait?: number;
}

async function registerNewEvent(args: NewEventArgs, __c3prLOG5?) {
    const {event_type, payload, c3prHubUrl, jwt, lcid, sha, euuid, retryWait = 2000} = args;
    let _c3prLOG5 = generateLogFunction(__c3prLOG5, lcid, sha, euuid);

    try {
        _c3prLOG5(`Registering new event of type '${event_type}'.`, {meta: {event_type, payload}});
        const client = axios.create({ baseURL: c3prHubUrl });

        // noinspection JSUnusedGlobalSymbols
        axiosRetry(client, { retries: 3, retryDelay: retryCount => retryCount * retryWait, retryCondition() { return true; } });

        const headers = {Authorization: `Bearer ${jwt}`};
        await client.post(`/api/v1/events/${event_type}`, payload, {headers});
    } catch (error) {
        _c3prLOG5(`Error while registering new event of type '${event_type}'.`, {error, meta: {payload}});
        throw error;
    }
}

export = {
    c3prRNE: {
        registerNewEvent
    }
};