const login = require('../login').c3prHubClient.login;
const collectEventAndMarkAsProcessing = require('./collectEventAndMarkAsProcessing').collectEventAndMarkAsProcessing.collectEventAndMarkAsProcessing;

(async () => {

    let jwt = await login({loginUrl: 'http://127.0.0.1:5000/api/v1/login'});
    console.log(jwt);

    collectEventAndMarkAsProcessing({
        c3prHubUrl: 'http://localhost:5000',
        jwt,
        event_type: 'ChangesCommitted'
    })
        .then(s => console.log('Success.', s))
        .catch(e => console.error('ERROR.', e));

})();