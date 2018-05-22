const config = require('../config');
const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;

const handleToolInvocationRequested = require('../application/ToolInvocationRequested/handleToolInvocationRequested').handleToolInvocationRequested.handleToolInvocationRequested;

const logMetas = [{nodeName: 'c3pr-agent', moduleName: 'c3prHubListenerController'}];

module.exports = function (app) {

    app.post(config.c3pr.agent.ToolInvocationRequestedCallbackUrl, function (request, response) {
        c3prLOG2({msg: `'ToolInvocationRequested' received.`, logMetas});
        handleToolInvocationRequested();
        response.send();
    });

};