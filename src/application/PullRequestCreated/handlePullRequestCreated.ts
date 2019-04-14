const config = require('../../config');
const handleFirstCollectedEvent = require('node-c3pr-hub-client/events/handleFirstCollectedEvent').default;
const savePR = require('./savePR');


function handlePullRequestCreated({lcid, sha, euuid}) {
    return handleFirstCollectedEvent({
        event_type: `PullRequestCreated`,
        handlerFunction: savePR,
        c3prHubUrl: config.c3pr.hub.c3prHubUrl,
        jwt: config.c3pr.auth.jwt,
        lcid, sha, euuid
    });
}

export = handlePullRequestCreated;