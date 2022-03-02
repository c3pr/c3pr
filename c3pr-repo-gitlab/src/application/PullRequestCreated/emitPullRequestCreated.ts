import c3prHubRegisterNewEvent from 'node-c3pr-hub-client/events/registerNewEvent';
import config from '../../config';


export function emitPullRequestCreated(pullRequestCreated, c3prLOG5) {
    c3prLOG5 = c3prLOG5({caller_name: 'emitPullRequestCreated'});
    c3prLOG5(
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
        c3prLOG5
    ).catch(error => {
        c3prLOG5(`Error while registering new event: PullRequestCreated.`, {error});
    });
}