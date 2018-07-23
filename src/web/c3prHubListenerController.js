const c3prLOG3 = require("node-c3pr-logger/c3prLOG3").default;
const config = require('../config');

const handleToolInvocationRequested = require('../application/ToolInvocationRequested/handleToolInvocationRequested').handleToolInvocationRequested.handleToolInvocationRequested;

module.exports = function (app) {

    app.post(config.c3pr.agent.ToolInvocationRequestedCallbackUrl, function (request, response) {
        c3prLOG3(`'ToolInvocationRequested' request received.`, {});
        // noinspection JSIgnoredPromiseFromCall
        handleToolInvocationRequested();
        response.send();
    });

};