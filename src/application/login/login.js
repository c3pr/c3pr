const config = require('../../config');

const c3prHubClient = require('node-c3pr-hub-client/login').c3prHubClient;

c3prHubClient.login({
    loginUrl: config.c3pr.hub.loginUrl,
    subscriptions: [
        {eventType: "ChangesCommitted",        callbackUrl: config.c3pr.brain.c3prBrainUrl + config.c3pr.brain.ChangesCommittedCallbackUrl},
        {eventType: "ToolInvocationCompleted", callbackUrl: config.c3pr.brain.c3prBrainUrl + config.c3pr.brain.ToolInvocationCompletedCallbackUrl},
        {eventType: "PullRequestUpdated",      callbackUrl: config.c3pr.brain.c3prBrainUrl + config.c3pr.brain.PullRequestUpdatedCallbackUrl}
    ],
    logMetas: [{nodeName: 'c3pr-brain', moduleName: 'login'}]
}).then(({data: jwt}) => {
    config.c3pr.jwt = jwt;
}).catch(e => {
    throw e;
});