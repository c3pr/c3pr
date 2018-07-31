const config = require('../../config');

const c3prHubClient = require('node-c3pr-hub-client/login').c3prHubClient;

const c3prLOG4 = require("node-c3pr-logger/c3prLOG4").default;
const lcid = c3prLOG4.lcid();
const euuid = 'brain-login';

c3prHubClient.login({
    loginUrl: config.c3pr.hub.loginUrl,
    username: 'c3pr-brain',
    password: 'unused',
    subscriptions: [
        {eventType: "ChangesCommitted",        callbackUrl: config.c3pr.brain.c3prBrainUrl + config.c3pr.brain.ChangesCommittedCallbackUrl},
        {eventType: "ToolInvocationCompleted", callbackUrl: config.c3pr.brain.c3prBrainUrl + config.c3pr.brain.ToolInvocationCompletedCallbackUrl},
        {eventType: "PullRequestCreated",      callbackUrl: config.c3pr.brain.c3prBrainUrl + config.c3pr.brain.PullRequestCreatedCallbackUrl},
        {eventType: "PullRequestUpdated",      callbackUrl: config.c3pr.brain.c3prBrainUrl + config.c3pr.brain.PullRequestUpdatedCallbackUrl}
    ],
    lcid,
    euuid
}).then(jwt => {
    config.c3pr.auth.jwt = jwt;
}).catch(e => {
    throw e;
});