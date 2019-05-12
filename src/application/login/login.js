const c3prHubLogin = require('node-c3pr-hub-client/login').default;

const config = require('../../config');
const hubRegistryBroadcast = require('./hubRegistryBroadcast');


module.exports = function c3prHubAgentLogin(c3prLOG5) {

    c3prHubLogin(
        {
            loginUrl: config.c3pr.hub.loginUrl,
            username: config.c3pr.agent.agentId,
            password: 'not-used',
            subscriptions: [
                {
                    eventType: "ToolInvocationRequested",
                    callbackUrl: config.c3pr.agent.agentUrl + config.c3pr.agent.ToolInvocationRequestedCallbackUrl
                }
            ]
        },
        c3prLOG5
    ).then(jwt => {
        config.c3pr.auth.jwt = jwt;

        hubRegistryBroadcast(c3prLOG5);
    }).catch(e => {
        throw e;
    });

};