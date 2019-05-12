const config = require('../../config');

const c3prHubLogin = require('node-c3pr-hub-client/login').default;

const c3prLOG5 = require("node-c3pr-logger/c3prLOG5").default;

const _c3prLOG5 = c3prLOG5({sha: '!dashboard-login'});

c3prHubLogin(
    {
    loginUrl: config.c3pr.hub.loginUrl,
    username: 'c3pr-dashboard',
    password: 'not-used',
    subscriptions: []
    },
    _c3prLOG5
).then(jwt => {
    config.c3pr.auth.jwt = jwt;
}).catch(e => {
    throw e;
});