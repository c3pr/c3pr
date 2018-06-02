const config = require('../../config');
const handleFirstCollectedEvent = require('node-c3pr-hub-client/events/handleFirstCollectedEvent').handleFirstCollectedEvent.handleFirstCollectedEvent;

const savePR = require('./savePR');

const logMetas = [{nodeName: 'c3pr-brain', moduleName: 'handlePullRequestCreated'}];

function handlePullRequestCreated() {
    return handleFirstCollectedEvent({
        event_type: `PullRequestCreated`,
        handlerFunction: savePR,
        c3prHubUrl: config.c3pr.hub.c3prHubUrl,
        jwt: config.c3pr.auth.jwt,
        logMetas
    });
}

module.exports = handlePullRequestCreated;