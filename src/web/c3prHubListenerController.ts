import config from '../config';

import handleChangesCommitted from "../application/ChangesCommitted/handleChangesCommitted";
const handlePullRequestCreated = require('../application/PullRequestCreated/handlePullRequestCreated');
const handlePullRequestUpdated = require('../application/PullRequestUpdated/handlePullRequestUpdated');

import c3prLOG5 from "node-c3pr-logger/c3prLOG5";
import handleToolInvocationCompleted from "../application/ToolInvocationCompleted/handleToolInvocationCompleted";

const sha = '!express-hub';

export = function (app) {

    app.post(config.c3pr.brain.ChangesCommittedCallbackUrl, function (request, response) {
        const _c3prLOG5 = c3prLOG5({sha});
        _c3prLOG5(`'ChangesCommitted' received.`);
        // noinspection JSIgnoredPromiseFromCall
        handleChangesCommitted(_c3prLOG5);
        response.send();
    });

    app.post(config.c3pr.brain.ToolInvocationCompletedCallbackUrl, function (request, response) {
        const _c3prLOG5 = c3prLOG5({sha});
        _c3prLOG5(`'ToolInvocationCompleted' received.`);
        // noinspection JSIgnoredPromiseFromCall
        handleToolInvocationCompleted(_c3prLOG5);
        response.send();
    });

    app.post(config.c3pr.brain.PullRequestCreatedCallbackUrl, function (request, response) {
        const _c3prLOG5 = c3prLOG5({sha});
        _c3prLOG5(`'PullRequestCreated' received.`);
        handlePullRequestCreated({..._c3prLOG5});
        response.send();
    });

    app.post(config.c3pr.brain.PullRequestUpdatedCallbackUrl, function (request, response) {
        const _c3prLOG5 = c3prLOG5({sha});
        _c3prLOG5(`'PullRequestUpdated' received.`);
        handlePullRequestUpdated({..._c3prLOG5});
        response.send();
    });

};