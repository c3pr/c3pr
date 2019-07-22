import axios from 'axios';
import axiosRetry from 'axios-retry/lib';

interface NewEventArgs {
    event_type: string;
    payload: any;
    c3prHubUrl: string;
    jwt: string;
    retryWait?: number;
}

export default async function c3prHubRegisterNewEvent(args: NewEventArgs, c3prLOG5) {
    const {event_type, payload, c3prHubUrl, jwt, retryWait = 2000} = args;

    try {
        c3prLOG5(`Registering new event of type '${event_type}'.`, {meta: {event_type, payload}});
        const client = axios.create({ baseURL: c3prHubUrl });

        // noinspection JSUnusedGlobalSymbols
        axiosRetry(client, { retries: 3, retryDelay: retryCount => retryCount * retryWait });

        const headers = {Authorization: `Bearer ${jwt}`};
        await client.post(`/api/v1/events/${event_type}`, payload, {headers});
    } catch (error) {
        c3prLOG5(`Error while registering new event of type '${event_type}'.`, {error, meta: {payload}});
        throw error;
    }
}
