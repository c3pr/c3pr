const handleFirstCollectedEvent = require('node-c3pr-hub-client/events/handleFirstCollectedEvent').default;
const config = require('../../config');

const handleToolInvocation = require('./handleToolInvocation');

const loadTools = require('../tools/loadTools');

function handleToolInvocationRequested(request, c3prLOG5) {

    if (!loadTools.toolsHash[request.body.payload.tool_id]) {
        c3prLOG5(`Received tool invocation is not from a tool_id of mine: ${request.body.payload.tool_id}. Skipping.`, {meta: {request_body: request.body}});
        return {skipped: true};
    }

    return handleFirstCollectedEvent({
        event_type: `ToolInvocationRequested`,
        handlerFunction: handleToolInvocation,
        c3prHubUrl: config.c3pr.hub.c3prHubUrl,
        jwt: config.c3pr.auth.jwt
    }, c3prLOG5);
}

module.exports = handleToolInvocationRequested;