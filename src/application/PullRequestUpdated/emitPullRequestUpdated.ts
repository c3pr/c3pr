import c3prHubRegisterNewEvent from "node-c3pr-hub-client/events/registerNewEvent";
import config from "../../config";

export default function emitPullRequestUpdated(pullRequestUpdated, c3prLOG5) {
    c3prLOG5(`Registering new event of type 'PullRequestUpdated' for repository ${pullRequestUpdated.repository.clone_url_http}.`, {meta: {pullRequestUpdated}});

    return c3prHubRegisterNewEvent(
        {
            event_type: `PullRequestUpdated`,
            payload: pullRequestUpdated,
            c3prHubUrl: config.c3pr.hub.c3prHubUrl,
            jwt: config.c3pr.hub.auth.jwt
        },
        c3prLOG5
    ).catch(error => {
        c3prLOG5(`Error while registering new event: PullRequestUpdated.`, {error, meta: {pullRequestUpdated}});
    });
}