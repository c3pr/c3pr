const config = require('../config');
const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;

const handlePullRequestRequested = require('../application/PullRequestRequested/handlePullRequestRequested');

const logMetas = [{nodeName: 'c3pr-repo-gitlab', moduleName: 'c3prHubListenerController'}];

module.exports = function (app) {

    app.post(config.c3pr.repoGitlab.PullRequestRequestedCallbackUrl, function (request, response) {
        c3prLOG2({msg: `'PullRequestRequested' received.`, logMetas});
        handlePullRequestRequested();
        response.send();
    });

};