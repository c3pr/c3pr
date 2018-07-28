const config = require('../config');

const handleToolInvocationRequested = require('../application/ToolInvocationRequested/handleToolInvocationRequested').handleToolInvocationRequested.handleToolInvocationRequested;

const c3prLOG4 = require("node-c3pr-logger/c3prLOG4").default;
const lcid = c3prLOG4.lcid();
const euuid = 'express';

module.exports = function (app) {

    app.post(config.c3pr.agent.ToolInvocationRequestedCallbackUrl, function (request, response) {
        c3prLOG4(`'ToolInvocationRequested' request received.`, {lcid, euuid});
        // noinspection JSIgnoredPromiseFromCall
        handleToolInvocationRequested({lcid, euuid});
        response.send();
    });

};