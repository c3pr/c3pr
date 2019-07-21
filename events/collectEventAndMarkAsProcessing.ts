const axios = require('axios').default;

async function patchAsProcessing(event, c3prHubUrl: string, headers, c3prLOG5) {
    try {
        await axios.patch(`${c3prHubUrl}/api/v1/events/${event.event_type}/${event.uuid}/meta/processing`, {}, {headers});
    } catch (error) {
        c3prLOG5(`Error while marking event ${event.uuid} of type ${event.event_type} as processing.`, {
            euuid: event.uuid,
            error
        });
        throw error;
    }
}

export async function collectEventAndMarkAsProcessing({event_type, c3prHubUrl, jwt}, c3prLOG5): Promise<any | null> {
    const headers = {Authorization: `Bearer ${jwt}`};

    let {data: event, status} = await axios.get(`${c3prHubUrl}/api/v1/events/${event_type}/peek/unprocessed`, {headers});

    if (status !== 200) {
        c3prLOG5(`Event of type ${event.event_type} errored. Probably somebody else fetched it first. Skipping for now.`, {meta: {status, event_type, axios_data: event}});
        return null;
    }

    await patchAsProcessing(event, c3prHubUrl, headers, c3prLOG5);
    return event;
}

export async function collectEventByIdAndMarkAsProcessing({event_uuid, c3prHubUrl, jwt}, c3prLOG5): Promise<any | null> {
    c3prLOG5 = c3prLOG5({caller_name: 'collectEventByIdAndMarkAsProcessing'});
    try {
        const headers = {Authorization: `Bearer ${jwt}`};

        /** @namespace event.payload */
        let {data: event, status} = await axios.get(`${c3prHubUrl}/api/v1/events/uuid/${event_uuid}`, {headers});

        if (status !== 200) {
            c3prLOG5(`Event ${event.event_type}/${event_uuid} errored. Skipping for now.`, {meta: {status, event_uuid, event}});
            return null;
        }
        if (event.meta.status !== 'UNPROCESSED') {
            c3prLOG5(`Event ${event.event_type}/${event_uuid} is not UNPROCESSED. Skipping for now.`, {meta: {event_uuid, event}});
            return null;
        }

        await patchAsProcessing(event, c3prHubUrl, headers, c3prLOG5);
        return event;
    } catch (error) {
        c3prLOG5(`Error while collecting ${event_uuid}`, {error, meta: {event_uuid}});
    }
}