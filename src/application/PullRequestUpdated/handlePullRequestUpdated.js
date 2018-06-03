const config = require('../../config');
const handleFirstCollectedEvent = require('node-c3pr-hub-client/events/handleFirstCollectedEvent').handleFirstCollectedEvent.handleFirstCollectedEvent;

const updatePR = require('./updatePR');

const logMetas = [{nodeName: 'c3pr-brain', moduleName: 'handlePullRequestUpdated'}];

function handlePullRequestUpdated() {
    return handleFirstCollectedEvent({
        event_type: `PullRequestUpdated`,
        handlerFunction: updatePR,
        c3prHubUrl: config.c3pr.hub.c3prHubUrl,
        jwt: config.c3pr.auth.jwt,
        logMetas
    });
}

module.exports = handlePullRequestUpdated;