const Sentry = require('@sentry/node');
import config from '../../../config';
import {handlePullRequestRequested} from "../../../application/PullRequestRequested/handlePullRequestRequested";
import {handleCommentPullRequest} from "../../../application/CommentPullRequest/handleCommentPullRequest";


import __c3prLOG5 from "node-c3pr-logger/c3prLOG5";
const c3prLOG5 = __c3prLOG5({sha: '!express-hub', caller_name: 'c3prHubListenerController'});

function euuid(request) {
    return request.body && request.body.uuid;
}
function sha(request) {
    return request.body.payload && request.body.payload.repository && request.body.payload.repository.revision || '!express-hub-listener-controller';
}

export default function (app) {

    app.post(config.c3pr.repoGitlab.PullRequestRequestedCallbackUrl, function (request, response) {
        const _c3prLOG5 = c3prLOG5({sha: sha(request), euuid: euuid(request)});
        _c3prLOG5(`'PullRequestRequested' command received.`);

        handlePullRequestRequested(request, _c3prLOG5).catch(Sentry.captureException);
        response.send('Comment received. I will process it, thanks.');
    });

    app.post(config.c3pr.repoGitlab.CommentPullRequestCallbackUrl, function (request, response) {
        const _c3prLOG5 = c3prLOG5({sha: sha(request), euuid: euuid(request)});
        _c3prLOG5(`'CommentPullRequest' command received.`);

        handleCommentPullRequest(request, _c3prLOG5).catch(Sentry.captureException);
        response.send('Comment received. I will process it, thanks.');
    });

};