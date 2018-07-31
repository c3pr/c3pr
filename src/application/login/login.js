const c3prHubClient = require('node-c3pr-hub-client/login').c3prHubClient;

const config = require('../../config');
const hubRegistryBroadcast = require('./hubRegistryBroadcast');

const c3prLOG4 = require("node-c3pr-logger/c3prLOG4").default;
const lcid = c3prLOG4.lcid();
const euuid = 'agent-login';

c3prHubClient.login({
    loginUrl: config.c3pr.hub.loginUrl,
    username: config.c3pr.agent.agentId,
    password: 'not-used',
    subscriptions: [
        {eventType: "ToolInvocationRequested", callbackUrl: config.c3pr.agent.agentUrl + config.c3pr.agent.ToolInvocationRequestedCallbackUrl}
    ],
    lcid,
    euuid
}).then(jwt => {
    config.c3pr.auth.jwt = jwt;

    hubRegistryBroadcast();
}).catch(e => {
    throw e;
});