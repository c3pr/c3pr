const handleFirstCollectedEvent = require('node-c3pr-hub-client/events/handleFirstCollectedEvent').handleFirstCollectedEvent.handleFirstCollectedEvent;
const config = require('../../config');

const handleToolInvocation = require('./handleToolInvocation');

const logMetas = [{nodeName: 'c3pr-agent', moduleName: 'handleToolInvocationRequested'}];


function handleToolInvocationRequested() {
    return handleFirstCollectedEvent({
        event_type: `ToolInvocationRequested`,
        handlerFunction: handleToolInvocation,
        c3prHubUrl: config.c3pr.hub.c3prHubUrl,
        jwt: config.c3pr.auth.jwt,
        logMetas
    });
}

module.exports = {
    handleToolInvocationRequested: {
        handleToolInvocationRequested
    }
};