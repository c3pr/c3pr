import config from '../config';

import handleChangesCommitted from "../application/ChangesCommitted/handleChangesCommitted";
const c3prHTIC = require('../application/ToolInvocationCompleted/handleToolInvocationCompleted').c3pr;
const handlePullRequestCreated = require('../application/PullRequestCreated/handlePullRequestCreated');
const handlePullRequestUpdated = require('../application/PullRequestUpdated/handlePullRequestUpdated');

import c3prLOG5 from "node-c3pr-logger/c3prLOG5";
import c3prLOG4 from "node-c3pr-logger/c3prLOG4";
const sha = 'express-hub';
const euuid = sha;

export = function (app) {

    app.post(config.c3pr.brain.ChangesCommittedCallbackUrl, function (request, response) {
        const _c3prLOG5 = c3prLOG5({sha, euuid});
        _c3prLOG5(`'ChangesCommitted' received.`);
        // noinspection JSIgnoredPromiseFromCall
        handleChangesCommitted(_c3prLOG5);
        response.send();
    });

    app.post(config.c3pr.brain.ToolInvocationCompletedCallbackUrl, function (request, response) {
        const lcid = c3prLOG4.lcid();
        c3prLOG4(`'ToolInvocationCompleted' received.`, {lcid, sha, euuid});
        c3prHTIC.handleToolInvocationCompleted({lcid, sha, euuid});
        response.send();
    });

    app.post(config.c3pr.brain.PullRequestCreatedCallbackUrl, function (request, response) {
        const lcid = c3prLOG4.lcid();
        c3prLOG4(`'PullRequestCreated' received.`, {lcid, sha, euuid});
        handlePullRequestCreated({lcid, sha, euuid});
        response.send();
    });

    app.post(config.c3pr.brain.PullRequestUpdatedCallbackUrl, function (request, response) {
        const lcid = c3prLOG4.lcid();
        c3prLOG4(`'PullRequestUpdated' received.`, {lcid, sha, euuid});
        handlePullRequestUpdated({lcid, sha, euuid});
        response.send();
    });

};