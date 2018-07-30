const config = require('../config');

const c3prHCC = require('../application/ChangesCommitted/handleChangesCommitted').c3pr;
const c3prHTIC = require('../application/ToolInvocationCompleted/handleToolInvocationCompleted').c3pr;
const handlePullRequestCreated = require('../application/PullRequestCreated/handlePullRequestCreated');
const handlePullRequestUpdated = require('../application/PullRequestUpdated/handlePullRequestUpdated');

const c3prLOG4 = require("node-c3pr-logger/c3prLOG4").default;
const euuid = 'express-hub';

module.exports = function (app) {

    app.post(config.c3pr.brain.ChangesCommittedCallbackUrl, function (request, response) {
        const lcid = c3prLOG4.lcid();
        c3prLOG4(`'ChangesCommitted' received.`, {lcid, euuid});
        c3prHCC.handleChangesCommitted({lcid, euuid});
        response.send();
    });

    app.post(config.c3pr.brain.ToolInvocationCompletedCallbackUrl, function (request, response) {
        const lcid = c3prLOG4.lcid();
        c3prLOG4(`'ToolInvocationCompleted' received.`, {lcid, euuid});
        c3prHTIC.handleToolInvocationCompleted({lcid, euuid});
        response.send();
    });

    app.post(config.c3pr.brain.PullRequestCreatedCallbackUrl, function (request, response) {
        const lcid = c3prLOG4.lcid();
        c3prLOG4(`'PullRequestCreated' received.`, {lcid, euuid});
        handlePullRequestCreated({lcid, euuid});
        response.send();
    });

    app.post(config.c3pr.brain.PullRequestUpdatedCallbackUrl, function (request, response) {
        const lcid = c3prLOG4.lcid();
        c3prLOG4(`'PullRequestUpdated' received.`, {lcid, euuid});
        handlePullRequestUpdated({lcid, euuid});
        response.send();
    });

};