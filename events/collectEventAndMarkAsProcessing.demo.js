const login = require('../login').c3prHubClient.login;
const collectEventAndMarkAsProcessing = require('./collectEventAndMarkAsProcessing').c3prCEAMAP.collectEventAndMarkAsProcessing;

(async () => {

    let jwt = await login({loginUrl: 'http://127.0.0.1:5000/api/v1/login'});
    console.log(jwt);

    collectEventAndMarkAsProcessing({
        c3prHubUrl: 'http://localhost:5000',
        jwt,
        eventType: 'ChangesCommitted'
    })
        .then(s => console.log('Success.', s))
        .catch(e => console.error('ERROR.', e));

})();