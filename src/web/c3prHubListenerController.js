const config = require('../config');
const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;

module.exports = function (app) {

    app.post(config.c3pr.repoGitlab.PullRequestRequestedCallbackUrl, function (request, response) {
        c3prLOG2({msg: `'PullRequestRequested' received.`});
        response.send();
    });

};