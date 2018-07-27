const axios = require('axios').default;
const axiosRetry = require('axios-retry');
const c3prLOG4 = require("node-c3pr-logger/c3prLOG4").default;


async function registerNewEvent({event_type, payload, c3prHubUrl, jwt, lcid, euuid, logMetas, retryWait = 2000}) {
    try {

        c3prLOG4(`Registering new event of type '${event_type}'.`, {lcid, euuid, logMetas, meta: {event_type, payload}});
        const client = axios.create({ baseURL: c3prHubUrl });

        // noinspection JSUnusedGlobalSymbols
        axiosRetry(client, { retries: 3, retryDelay: retryCount => retryCount * retryWait, retryCondition() { return true; } });

        const headers = {Authorization: `Bearer ${jwt}`};
        await client.post(`/api/v1/events/${event_type}`, payload, {headers});
    } catch (error) {
        c3prLOG4(`Error while registering new event of type '${event_type}'.`, {lcid, euuid, logMetas, error, meta: {payload}});
        throw error;
    }
}

module.exports = {
    c3prRNE: {
        registerNewEvent
    }
};