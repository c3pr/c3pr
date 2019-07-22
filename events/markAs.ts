import axios from 'axios';
import axiosRetry from 'axios-retry/lib';


async function markAs({new_status, event_type, uuid, c3prHubUrl, jwt, retryWait = 2000}, c3prLOG5) {
    const client = axios.create({ baseURL: c3prHubUrl });
    axiosRetry(client, { retries: 3, retryDelay: retryCount => retryCount * retryWait, retryCondition() { return true; } });

    const headers = {Authorization: `Bearer ${jwt}`};

    let status;
    try {
        let response = await client.patch(`/api/v1/events/${event_type}/${uuid}/meta/${new_status.toLowerCase()}`, {}, {headers});
        status = response.status;
    } catch (error) {
        c3prLOG5(`Error while marking event ${uuid} of type ${event_type} as ${new_status.toUpperCase()}.`, {error});
        throw error;
    }
    if (status === 401) {
        c3prLOG5(`Token deemed invalid while marking event ${uuid} of type ${event_type} as ${new_status.toUpperCase()}.`);
        throw new Error('Invalid JWT token');
    }
}

export function markAsProcessed({event_type, uuid, c3prHubUrl, jwt}, c3prLOG5) {
    return markAs({new_status: 'processed', event_type, uuid, c3prHubUrl, jwt}, c3prLOG5)
}

export function markAsUnprocessed({event_type, uuid, c3prHubUrl, jwt}, c3prLOG5) {
    return markAs({new_status: 'unprocessed', event_type, uuid, c3prHubUrl, jwt}, c3prLOG5)
}

export function markAsProcessing({event_type, uuid, c3prHubUrl, jwt}, c3prLOG5) {
    return markAs({new_status: 'processing', event_type, uuid, c3prHubUrl, jwt}, c3prLOG5)
}
