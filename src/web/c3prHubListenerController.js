const config = require('../config');

const handleToolInvocationRequested = require('../application/ToolInvocationRequested/handleToolInvocationRequested');

const c3prLOG4 = require("node-c3pr-logger/c3prLOG4").default;
const sha = 'express-agent-hub-listener-controller';
const euuid = sha;

module.exports = function (app) {

    app.post(config.c3pr.agent.ToolInvocationRequestedCallbackUrl, function (request, response) {
        const lcid = c3prLOG4.lcid();
        c3prLOG4(`'ToolInvocationRequested' request received.`, {lcid, sha, euuid});
        // noinspection JSIgnoredPromiseFromCall
        handleToolInvocationRequested({lcid, sha, euuid});
        response.send();
    });

};