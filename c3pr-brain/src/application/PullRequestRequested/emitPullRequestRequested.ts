import c3prLOG5 from "node-c3pr-logger/c3prLOG5";
import config from '../../config';
import c3prHubRegisterNewEvent from "node-c3pr-hub-client/events/registerNewEvent";

function emitPullRequestRequested(pullRequestRequested, {lcid, sha, euuid}) {
    const _c3prLOG5 = c3prLOG5({lcid, sha, euuid});
    _c3prLOG5(
        `Registering new event of type 'PullRequestRequested' for repository ${pullRequestRequested.repository.clone_url_http} and rev ${pullRequestRequested.repository.revision}.`,
        {meta: {payload: pullRequestRequested}}
    );

    return c3prHubRegisterNewEvent(
        {
            event_type: `PullRequestRequested`,
            payload: pullRequestRequested,
            c3prHubUrl: config.c3pr.hub.c3prHubUrl,
            jwt: config.c3pr.auth.jwt
        },
        _c3prLOG5
    ).catch(error => {
        _c3prLOG5(`Error while registering new event: PullRequestRequested.`, {error});
    });
}

export = emitPullRequestRequested;