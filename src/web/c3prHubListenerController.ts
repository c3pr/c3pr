import config from '../config';
import { c3prLOG2 } from "node-c3pr-logger/c3prLOG2";

import handlePullRequestRequested = require('../application/PullRequestRequested/handlePullRequestRequested');

const logMetas = [{nodeName: 'c3pr-repo-gitlab', moduleName: 'c3prHubListenerController'}];

export = function (app) {

    app.post(config.c3pr.repoGitlab.PullRequestRequestedCallbackUrl, function (request, response) {
        c3prLOG2({msg: `'PullRequestRequested' received.`, logMetas});
        handlePullRequestRequested();
        response.send();
    });

};