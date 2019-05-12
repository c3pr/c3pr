const config = require('../config');

const handleToolInvocationRequested = require('../application/ToolInvocationRequested/handleToolInvocationRequested');

const c3prLOG5 = require("node-c3pr-logger/c3prLOG5").default;

module.exports = function (app) {

    app.post(config.c3pr.agent.ToolInvocationRequestedCallbackUrl, function (request, response) {
        const _c3prLOG5 = c3prLOG5({sha: '!express-agent-hub-listener-controller'});
        _c3prLOG5(`'ToolInvocationRequested' request received.`);
        // noinspection JSIgnoredPromiseFromCall
        handleToolInvocationRequested({..._c3prLOG5});
        response.send();
    });

};