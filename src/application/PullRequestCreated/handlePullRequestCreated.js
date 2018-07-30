const config = require('../../config');
const handleFirstCollectedEvent = require('node-c3pr-hub-client/events/handleFirstCollectedEvent').default;
const savePR = require('./savePR');


function handlePullRequestCreated({lcid, euuid}) {
    return handleFirstCollectedEvent({
        event_type: `PullRequestCreated`,
        handlerFunction: savePR,
        c3prHubUrl: config.c3pr.hub.c3prHubUrl,
        jwt: config.c3pr.auth.jwt,
        lcid,
        euuid
    });
}

module.exports = handlePullRequestCreated;