const handleFirstCollectedEvent = require('node-c3pr-hub-client/events/handleFirstCollectedEvent').default;
const createAndEmitPullRequestRequested = require('./createAndEmitPullRequestRequested');
import config from '../../config';


function handleToolInvocationCompleted({lcid, sha, euuid}) {
    return handleFirstCollectedEvent({
        event_type: `ToolInvocationCompleted`,
        handlerFunction: createAndEmitPullRequestRequested,
        c3prHubUrl: config.c3pr.hub.c3prHubUrl,
        jwt: config.c3pr.auth.jwt,
        lcid, sha, euuid
    });
}

export = {
    c3pr: {
        handleToolInvocationCompleted
    }
};