const Sentry = require('@sentry/node');

import config from '../config';

import handleChangesCommitted from "../application/ChangesCommitted/handleChangesCommitted";
import handlePullRequestCreated from '../application/PullRequestCreated/handlePullRequestCreated';

import handleToolInvocationCompleted from "../application/ToolInvocationCompleted/handleToolInvocationCompleted";
import handlePullRequestUpdated from '../application/PullRequestUpdated/handlePullRequestUpdated';

import __c3prLOG5 from "node-c3pr-logger/c3prLOG5";
const c3prLOG5 = __c3prLOG5({sha: '!express-hub', caller_name: 'c3prHubListenerController'});

function euuid(request) {
    return request.body && request.body.uuid;
}
function sha(request) {
    return request.body.payload && request.body.payload.repository && request.body.payload.repository.revision || '!express-agent-hub-listener-controller';
}

export = function (app) {

    app.post(config.c3pr.brain.ChangesCommittedCallbackUrl, function (request, response) {
        const _c3prLOG5 = c3prLOG5({sha: sha(request), euuid: euuid(request)});
        _c3prLOG5(`'ChangesCommitted' request received.`);
        handleChangesCommitted(request, c3prLOG5).catch(Sentry.captureException);
        response.send();
    });

    app.post(config.c3pr.brain.ToolInvocationCompletedCallbackUrl, function (request, response) {
        const _c3prLOG5 = c3prLOG5({sha: sha(request), euuid: euuid(request)});
        _c3prLOG5(`'ToolInvocationCompleted' request received.`);
        handleToolInvocationCompleted(request, c3prLOG5).catch(Sentry.captureException);
        response.send();
    });

    app.post(config.c3pr.brain.PullRequestCreatedCallbackUrl, function (request, response) {
        const _c3prLOG5 = c3prLOG5({sha: sha(request), euuid: euuid(request)});
        _c3prLOG5(`'PullRequestCreated' request received.`);
        handlePullRequestCreated(request, c3prLOG5).catch(Sentry.captureException);
        response.send();
    });

    app.post(config.c3pr.brain.PullRequestUpdatedCallbackUrl, function (request, response) {
        const _c3prLOG5 = c3prLOG5({sha: sha(request), euuid: euuid(request)});
        _c3prLOG5(`'PullRequestUpdated' request received.`);
        handlePullRequestUpdated(request, c3prLOG5).catch(Sentry.captureException);
        response.send();
    });

};