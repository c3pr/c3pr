const config = require('../../config');

const c3prHubClient = require('node-c3pr-hub-client/login').c3prHubClient;

c3prHubClient.login({
    loginUrl: config.c3pr.hub.loginUrl,
    subscriptions: [],
    logMetas: [{nodeName: 'c3pr-dashboard', moduleName: 'login'}]
}).then(jwt => {
    config.c3pr.auth.jwt = jwt;
}).catch(e => {
    throw e;
});