const login = require('../login').c3prHubClient.login;
const collectEventAndMarkAsProcessing = require('./collectEventAndMarkAsProcessing').collectEventAndMarkAsProcessing.collectEventAndMarkAsProcessing;
const markAsProcessed = require('./markAsProcessed').markAsProcessed.markAsProcessed;

(async () => {
    const c3prHubUrl = 'http://localhost:5000';
    const event_type = 'ChangesCommitted';

    let jwt = await login({loginUrl: 'http://127.0.0.1:5000/api/v1/login'});
    console.log('Logged in.', jwt);
    console.log('\n');

    let event = await collectEventAndMarkAsProcessing({
        c3prHubUrl,
        jwt,
        event_type
    });
    console.log('Collected event.', event);

    if (!event) {
        console.log('nothing collected, to I wont attempt to mark as processed', event);
        return;
    }

    await markAsProcessed({jwt, c3prHubUrl, event_type, uuid: event.uuid});
    console.log('Done marking as processed!');

    await markAsProcessed({jwt, c3prHubUrl, event_type, uuid: event.uuid});
    await markAsProcessed({jwt, c3prHubUrl, event_type, uuid: event.uuid});
    console.log('Marking more than once was okay!!');

})()
    .then(s => console.log('Success.', s))
    .catch(e => console.error('ERROR.', e));