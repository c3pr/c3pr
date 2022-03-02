const c3prHubRegisterNewEvent = require('./registerNewEvent').default;

const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const axiosMock = new MockAdapter(axios);

describe('registerNewEvent', () => {

    it('registerNewEvent automatically retries 3 times', async () => {

        const event_type = "someEvent";
        const c3prHubUrl = 'http://localhost:5004';
        const jwt = "jwt";
        const payload = {a: 123};

        axiosMock
            .onPost(`${c3prHubUrl}/api/v1/events/${event_type}`, payload).replyOnce(500)
            .onPost(`${c3prHubUrl}/api/v1/events/${event_type}`, payload).replyOnce(500)
            .onPost(`${c3prHubUrl}/api/v1/events/${event_type}`, payload).replyOnce(500)
            .onPost(`${c3prHubUrl}/api/v1/events/${event_type}`, payload).replyOnce(200);

        await c3prHubRegisterNewEvent({
            event_type,
            c3prHubUrl,
            jwt,
            payload,
            retryWait: 50
        }, console.log);
    });

});

