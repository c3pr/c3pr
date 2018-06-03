"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UNCONFIGURED = 'call hubClientConfig.init() before using any functions from node-c3pr-hub-client.';
const UNCONFIGURED_ARG0 = () => { throw new Error(UNCONFIGURED); };
const UNCONFIGURED_ARG1 = (ignore) => { throw new Error(UNCONFIGURED); };
const hubClientConfig = {
    c3pr: {
        hub: {
            auth: {
                jwt: UNCONFIGURED_ARG0,
            },
            c3prHubUrl: UNCONFIGURED,
            loginUrl: UNCONFIGURED,
            eventsUrl: UNCONFIGURED_ARG1,
            projectsByCloneUrlHttp: UNCONFIGURED_ARG1,
            prsForProjectUrl: UNCONFIGURED_ARG1,
        },
    },
    init(C3PR_HUB_URL, jwt) {
        hubClientConfig.c3pr.hub.auth.jwt = jwt;
        hubClientConfig.c3pr.hub.c3prHubUrl = C3PR_HUB_URL;
        hubClientConfig.c3pr.hub.loginUrl = `${C3PR_HUB_URL}/api/v1/login`;
        hubClientConfig.c3pr.hub.eventsUrl = ({ event_type, uuid }) => `${C3PR_HUB_URL}/api/v1/events/${event_type}/${uuid}`;
        hubClientConfig.c3pr.hub.projectsByCloneUrlHttp = (clone_url_http) => `${C3PR_HUB_URL}/api/v1/projects/?clone_url_http=${clone_url_http}`;
        hubClientConfig.c3pr.hub.prsForProjectUrl = (project_uuid) => `${C3PR_HUB_URL}/api/v1/projects/${project_uuid}/prs`;
    },
    headers() {
        return { Authorization: `Bearer ${hubClientConfig.c3pr.hub.auth.jwt()}` };
    }
};
exports.hubClientConfig = hubClientConfig;
//# sourceMappingURL=index.js.map