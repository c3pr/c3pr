const handleFirstCollectedEvent = require('node-c3pr-hub-client/events/handleFirstCollectedEvent').handleFirstCollectedEvent.handleFirstCollectedEvent;

const createAndEmitPullRequestRequested = require('./createAndEmitPullRequestRequested');

const config = require('../../config');

const logMetas = [{nodeName: 'c3pr-brain', moduleName: 'handleToolInvocationCompleted'}];

function handleToolInvocationCompleted() {
    return handleFirstCollectedEvent({
        event_type: `ToolInvocationCompleted`,
        handlerFunction: createAndEmitPullRequestRequested,
        c3prHubUrl: config.c3pr.hub.c3prHubUrl,
        jwt: config.c3pr.auth.jwt,
        logMetas
    });
}

module.exports = {
    c3pr: {
        handleToolInvocationCompleted
    }
};