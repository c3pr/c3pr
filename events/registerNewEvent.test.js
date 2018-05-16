require("node-c3pr-logger").testMode();
process.env.NODE_ENV = 'test';

const registerNewEvent = require('./registerNewEvent').c3prRNE.registerNewEvent;

const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const axiosMock = new MockAdapter(axios);

describe('registerNewEvent', () => {

    it('registerNewEvent automatically retries 3 times', async () => {

        const eventType = "someEvent";
        const c3prHubUrl = 'http://localhost:5004';
        const jwt = "jwt";
        const payload = {a: 123};

        axiosMock
            .onPost(`${c3prHubUrl}/api/v1/events/${eventType}`, payload).replyOnce(500)
            .onPost(`${c3prHubUrl}/api/v1/events/${eventType}`, payload).replyOnce(500)
            .onPost(`${c3prHubUrl}/api/v1/events/${eventType}`, payload).replyOnce(500)
            .onPost(`${c3prHubUrl}/api/v1/events/${eventType}`, payload).replyOnce(200);

        await registerNewEvent({
            eventType,
            c3prHubUrl,
            jwt,
            payload,
            retryWait: 50
        });
    });

});

