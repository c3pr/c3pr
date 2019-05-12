const handleFirstCollectedEvent = require('node-c3pr-hub-client/events/handleFirstCollectedEvent').default;
const config = require('../../config');

const handleToolInvocation = require('./handleToolInvocation');


function handleToolInvocationRequested(c3prLOG5) {
    return handleFirstCollectedEvent({
        event_type: `ToolInvocationRequested`,
        handlerFunction: handleToolInvocation,
        c3prHubUrl: config.c3pr.hub.c3prHubUrl,
        jwt: config.c3pr.auth.jwt
    }, c3prLOG5);
}

module.exports = handleToolInvocationRequested;