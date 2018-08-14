const config = require('../../config');
const handleFirstCollectedEvent = require('node-c3pr-hub-client/events/handleFirstCollectedEvent').default;

const updatePR = require('./updatePR');


function handlePullRequestUpdated({lcid, sha, euuid}) {
    return handleFirstCollectedEvent({
        event_type: `PullRequestUpdated`,
        handlerFunction: updatePR,
        c3prHubUrl: config.c3pr.hub.c3prHubUrl,
        jwt: config.c3pr.auth.jwt,
        lcid, sha, euuid
    });
}

module.exports = handlePullRequestUpdated;