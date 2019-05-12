const c3prHubLogin = require('node-c3pr-hub-client/login').default;

const config = require('../../config');
const hubRegistryBroadcast = require('./hubRegistryBroadcast');
const c3prLOG5 = require("node-c3pr-logger/c3prLOG5").default;

const _c3prLOG5 = c3prLOG5({sha: '!agent-login'});

c3prHubLogin({
    loginUrl: config.c3pr.hub.loginUrl,
    username: config.c3pr.agent.agentId,
    password: 'not-used',
    subscriptions: [
        {eventType: "ToolInvocationRequested", callbackUrl: config.c3pr.agent.agentUrl + config.c3pr.agent.ToolInvocationRequestedCallbackUrl}
    ]},
    ..._c3prLOG5
).then(jwt => {
    config.c3pr.auth.jwt = jwt;

    hubRegistryBroadcast();
}).catch(e => {
    throw e;
});