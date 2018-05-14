const config = require('../../config');

const c3prHubClient = require('../../../../node-c3pr-hub-client/login').c3prHubClient;

c3prHubClient.login({
    loginUrl: config.c3pr.hub.loginUrl,
    subscriptions: [
        {eventType: "changes",                  callbackUrl: config.c3pr.brain.changesCallbackUrl},
        {eventType: "complete-tool-invocation", callbackUrl: config.c3pr.brain.completeToolInvocationCallbackUrl},
        {eventType: "patch",                    callbackUrl: config.c3pr.brain.patchCallbackUrl}
    ],
    logMetas: [{nodeName: 'c3pr-repo-brain'}]
}).then(({data: jwt}) => {
    config.c3pr.jwt = jwt;
}).catch(e => {
    throw e;
});