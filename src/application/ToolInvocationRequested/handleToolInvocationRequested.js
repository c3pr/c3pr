const handleFirstCollectedEvent = require('node-c3pr-hub-client/events/handleFirstCollectedEvent').default;
const config = require('../../config');

const handleToolInvocation = require('./handleToolInvocation');


function handleToolInvocationRequested({lcid, sha, euuid}) {
    return handleFirstCollectedEvent({
        event_type: `ToolInvocationRequested`,
        handlerFunction: handleToolInvocation,
        c3prHubUrl: config.c3pr.hub.c3prHubUrl,
        jwt: config.c3pr.auth.jwt,
        lcid, sha, euuid
    });
}

module.exports = handleToolInvocationRequested;