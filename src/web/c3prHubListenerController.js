const config = require('../config');
const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;

const c3prHCC = require('../application/ChangesCommitted/handleChangesCommitted').c3pr;
const c3prHTIC = require('../application/ToolInvocationCompleted/handleToolInvocationCompleted').c3pr;

const logMetas = [{nodeName: 'c3pr-brain', moduleName: 'c3prHubListenerController'}];

module.exports = function (app) {

    app.post(config.c3pr.brain.ChangesCommittedCallbackUrl, function (request, response) {
        c3prLOG2({msg: `'ChangesCommitted' received.`, logMetas});
        c3prHCC.handleChangesCommitted();
        response.send();
    });

    app.post(config.c3pr.brain.ToolInvocationCompletedCallbackUrl, function (request, response) {
        c3prLOG2({msg: `'ToolInvocationCompleted' received.`, logMetas});
        c3prHTIC.handleToolInvocationCompleted();
        response.send();
    });

    app.post(config.c3pr.brain.PullRequestUpdatedCallbackUrl, function (request, response) {
        c3prLOG2({msg: `'PullRequestUpdated' received.`, logMetas});
        response.send();
    });

};