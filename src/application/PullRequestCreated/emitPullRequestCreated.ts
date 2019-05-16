import c3prLOG5 from "node-c3pr-logger/c3prLOG5";
import c3prHubRegisterNewEvent from 'node-c3pr-hub-client/events/registerNewEvent';
import config from '../../config';


export function emitPullRequestCreated(pullRequestCreated, {lcid, sha, euuid}) {
    const _c3prLOG5 = c3prLOG5({lcid, sha, euuid});
    _c3prLOG5(
        `Registering new event of type 'PullRequestCreated' for repository ${pullRequestCreated.repository.clone_url_http} and rev ${pullRequestCreated.repository.revision}.`,
        {meta: {payload: pullRequestCreated}}
    );

    return c3prHubRegisterNewEvent(
        {
            event_type: `PullRequestCreated`,
            payload: pullRequestCreated,
            c3prHubUrl: config.c3pr.hub.c3prHubUrl,
            jwt: config.c3pr.hub.auth.jwt
        },
        _c3prLOG5
    ).catch(error => {
        _c3prLOG5(`Error while registering new event: PullRequestCreated.`, {error});
    });
}