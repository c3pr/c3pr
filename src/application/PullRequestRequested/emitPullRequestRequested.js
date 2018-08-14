const c3prLOG4 = require("node-c3pr-logger/c3prLOG4").default;
const c3prRNE = require('node-c3pr-hub-client/events/registerNewEvent').c3prRNE;

const config = require('../../config');


function emitPullRequestRequested(pullRequestRequested, {lcid, sha, euuid}) {
    c3prLOG4(
        `Registering new event of type 'PullRequestRequested' for repository ${pullRequestRequested.repository.clone_url_http} and rev ${pullRequestRequested.repository.revision}.`,
        {lcid, sha, euuid, meta: {payload: pullRequestRequested}
    });

    return c3prRNE.registerNewEvent({
        event_type: `PullRequestRequested`,
        payload: pullRequestRequested,
        c3prHubUrl: config.c3pr.hub.c3prHubUrl,
        jwt: config.c3pr.auth.jwt,
        lcid, sha, euuid
    }).catch(error => {
        c3prLOG4(`Error while registering new event: PullRequestRequested.`, {lcid, sha, euuid, error});
    });
}

module.exports = emitPullRequestRequested;