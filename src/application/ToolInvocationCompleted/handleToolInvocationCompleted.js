const handleFirstCollectedEvent = require('node-c3pr-hub-client/events/handleFirstCollectedEvent').default;
const createAndEmitPullRequestRequested = require('./createAndEmitPullRequestRequested');
const config = require('../../config');


function handleToolInvocationCompleted({lcid, euuid}) {
    return handleFirstCollectedEvent({
        event_type: `ToolInvocationCompleted`,
        handlerFunction: createAndEmitPullRequestRequested,
        c3prHubUrl: config.c3pr.hub.c3prHubUrl,
        jwt: config.c3pr.auth.jwt,
        lcid,
        euuid
    });
}

module.exports = {
    c3pr: {
        handleToolInvocationCompleted
    }
};