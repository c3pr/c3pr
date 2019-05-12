import config from '../../config';

const c3prHubClient = require('node-c3pr-hub-client/login').c3prHubClient;
import c3prLOG5 from "node-c3pr-logger/c3prLOG5";

const _c3prLOG5 = c3prLOG5({sha: '!brain-login'});

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
    ..._c3prLOG5
}).then(jwt => {
    config.c3pr.auth.jwt = jwt;
}).catch(e => {
    throw e;
});