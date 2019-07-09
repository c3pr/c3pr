const config = require('../config');

const handleToolInvocationRequested = require('../application/ToolInvocationRequested/handleToolInvocationRequested');

let c3prLOG5 = require("node-c3pr-logger/c3prLOG5").default;
c3prLOG5 = c3prLOG5({service_name: 'c3pr-agent#'+config.c3pr.agent.agentId, caller_name: 'c3prHubListenerController', euuid: request.body.event && request.body.event.uuid});

function euuid(request) {
    return request.body && request.body.uuid;
}
function sha(request) {
    return request.body.payload && request.body.payload.repository && request.body.payload.repository.revision || '!express-agent-hub-listener-controller';
}

module.exports = function (app) {

    app.post(config.c3pr.agent.ToolInvocationRequestedCallbackUrl, function (request, response) {
        const _c3prLOG5 = c3prLOG5({sha: sha(request), euuid: euuid(request)});
        _c3prLOG5(`'ToolInvocationRequested' request received.`);
        // noinspection JSIgnoredPromiseFromCall
        handleToolInvocationRequested(request, _c3prLOG5);
        response.send();
    });

};