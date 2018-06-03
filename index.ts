const UNCONFIGURED = 'call hubClientConfig.init() before using any functions from node-c3pr-hub-client.';
const UNCONFIGURED_ARG0 = (): string => {throw new Error(UNCONFIGURED)};
const UNCONFIGURED_ARG1 = (ignore): string => {throw new Error(UNCONFIGURED)};
const UNCONFIGURED_ARG2= (ignore, ignore2): string => {throw new Error(UNCONFIGURED)};


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
            prOfProjectUrl: UNCONFIGURED_ARG2,
        },

    },
    init(C3PR_HUB_URL: string, jwt: () => string) {
        hubClientConfig.c3pr.hub.auth.jwt = jwt;
        hubClientConfig.c3pr.hub.c3prHubUrl = C3PR_HUB_URL;
        hubClientConfig.c3pr.hub.loginUrl = `${C3PR_HUB_URL}/api/v1/login`;
        hubClientConfig.c3pr.hub.eventsUrl = ({event_type, uuid}) => `${C3PR_HUB_URL}/api/v1/events/${event_type}/${uuid}`;
        hubClientConfig.c3pr.hub.projectsByCloneUrlHttp = (clone_url_http) => `${C3PR_HUB_URL}/api/v1/projects/?clone_url_http=${clone_url_http}`;
        hubClientConfig.c3pr.hub.prsForProjectUrl = (project_uuid) => `${C3PR_HUB_URL}/api/v1/projects/${project_uuid}/prs`;
        hubClientConfig.c3pr.hub.prOfProjectUrl = (project_uuid, pr_id) => `${C3PR_HUB_URL}/api/v1/projects/${project_uuid}/prs/${pr_id}`;
    },
    headers() {
        return {Authorization: `Bearer ${hubClientConfig.c3pr.hub.auth.jwt()}`};
    }
};

export { hubClientConfig };

export * from './types/Event';
export * from './types/PR';