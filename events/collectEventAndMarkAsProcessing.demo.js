require("node-c3pr-logger").testMode();
const login = require('../login').c3prHubClient.login;
const collectEventAndMarkAsProcessing = require('./collectEventAndMarkAsProcessing').collectEventAndMarkAsProcessing.collectEventAndMarkAsProcessing;

(async () => {

    let jwt = await login({loginUrl: 'http://127.0.0.1:7300/api/v1/login', username: 'u', password: 'p'});
    console.log(jwt);

    collectEventAndMarkAsProcessing({
        c3prHubUrl: 'http://localhost:7300',
        jwt,
        event_type: 'ChangesCommitted'
    })
        .then(s => console.log('Success.', s))
        .catch(e => console.error('ERROR.', e));

})();