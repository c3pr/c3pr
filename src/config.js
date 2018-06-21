const os = require("os");
const hubClientConfig = require('node-c3pr-hub-client').hubClientConfig;

const C3PR_HUB_URL = process.env.C3PR_HUB_URL || `http://${os.hostname()}:5000`;

const C3PR_BRAIN_URL = process.env.C3PR_BRAIN_URL || `http://${os.hostname()}:5001`;

// noinspection JSUnusedLocalSymbols
const C3PR_MONGO_URL = process.env.C3PR_MONGO_URL; // REQUIRED DUE TO C3PR LOGGER

const config = {
    c3pr: {
        auth: {
            jwt: null,
        },

        hub: {
            c3prHubUrl: C3PR_HUB_URL,
            loginUrl: `${C3PR_HUB_URL}/api/v1/login`,

            agentsUrl: `${C3PR_HUB_URL}/api/v1/agents`,
            changesCommittedOfUuidUrl: `${C3PR_HUB_URL}/api/v1/events/ChangesCommitted/:uuid`,
            toolInvocationRequestedForRoot: `${C3PR_HUB_URL}/api/v1/events/ToolInvocationRequested?payload.changes_committed_root=`,
            filesWithOpenPRsForProjectUrl: `${C3PR_HUB_URL}/api/v1/projects/:project_uuid/prs/open/changed_files`,
        },

        brain: {
            c3prBrainUrl: C3PR_BRAIN_URL,
            c3prBrainPort: require('url').parse(C3PR_BRAIN_URL).port || 80,

            ChangesCommittedCallbackUrl:        `/callbacks/ChangesCommitted`,
            ToolInvocationCompletedCallbackUrl: `/callbacks/ToolInvocationCompleted`,
            PullRequestCreatedCallbackUrl:      `/callbacks/PullRequestCreated`,
            PullRequestUpdatedCallbackUrl:      `/callbacks/PullRequestUpdated`
        }
    }
};

hubClientConfig.init(C3PR_HUB_URL, () => config.c3pr.auth.jwt);
module.exports = config;