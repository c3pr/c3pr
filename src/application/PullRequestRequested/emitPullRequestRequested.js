const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;
const c3prRNE = require('node-c3pr-hub-client/events/registerNewEvent').c3prRNE;

const config = require('../../config');


function emitPullRequestRequested(pullRequestRequested, outerLogMetas) {
    const logMeta = {nodeName: 'c3pr-brain', correlationId: pullRequestRequested.repository.revision, moduleName: 'emitPullRequestRequested'};
    const logMetas = [...(outerLogMetas || []), logMeta];

    c3prLOG2({
        msg: `Registering new event of type 'PullRequestRequested' for repository ${pullRequestRequested.repository.clone_url_http} and rev ${pullRequestRequested.repository.revision}.`,
        logMetas,
        meta: {payload: pullRequestRequested}
    });

    return c3prRNE.registerNewEvent({
        event_type: `PullRequestRequested`,
        payload: pullRequestRequested,
        c3prHubUrl: config.c3pr.hub.c3prHubUrl,
        jwt: config.c3pr.auth.jwt,
        logMetas
    })
        .catch(e => {
            c3prLOG2({
                msg: `Error while registering new event: PullRequestRequested. Reason: '${e}'. Data: ${e.response && e.response.data}.`,
                logMetas,
                meta: {error: require('util').inspect(e)}
            });
        })
}

module.exports = emitPullRequestRequested;