const Sentry = require('@sentry/node');

import config from '../config';
import __c3prLOG5 from "node-c3pr-logger/c3prLOG5";

import handleChangesCommitted from "../application/ChangesCommitted/handleChangesCommitted";
const handlePullRequestCreated = require('../application/PullRequestCreated/handlePullRequestCreated');

import handleToolInvocationCompleted from "../application/ToolInvocationCompleted/handleToolInvocationCompleted";
import handlePullRequestUpdated from '../application/PullRequestUpdated/handlePullRequestUpdated';

const c3prLOG5 = __c3prLOG5({sha: '!express-hub', caller_name: 'c3prHubListenerController'});

export = function (app) {

    app.post(config.c3pr.brain.ChangesCommittedCallbackUrl, function (request, response) {
        c3prLOG5(`'ChangesCommitted' received.`);
        handleChangesCommitted(c3prLOG5).catch(Sentry.captureException);
        response.send();
    });

    app.post(config.c3pr.brain.ToolInvocationCompletedCallbackUrl, function (request, response) {
        c3prLOG5(`'ToolInvocationCompleted' received.`);
        handleToolInvocationCompleted(c3prLOG5).catch(Sentry.captureException);
        response.send();
    });

    app.post(config.c3pr.brain.PullRequestCreatedCallbackUrl, function (request, response) {
        c3prLOG5(`'PullRequestCreated' received.`);
        handlePullRequestCreated({...c3prLOG5});
        response.send();
    });

    app.post(config.c3pr.brain.PullRequestUpdatedCallbackUrl, function (request, response) {
        c3prLOG5(`'PullRequestUpdated' received.`);
        handlePullRequestUpdated(c3prLOG5).catch(Sentry.captureException);
        response.send();
    });

};