const os = require("os");

const C3PR_HUB_URL = process.env.C3PR_HUB_URL || `http://${os.hostname()}:5000`;

const C3PR_BRAIN_URL = process.env.C3PR_BRAIN_URL || `http://${os.hostname()}:5001`;

module.exports = {
    c3pr: {
        auth: {
            jwt: null,
        },

        hub: {
            c3prHubUrl: C3PR_HUB_URL,
            loginUrl: `${C3PR_HUB_URL}/api/v1/login`,

            registryUrl: `${C3PR_HUB_URL}/api/v1/registry`,
            toolInvocationRequestedForRoot: `${C3PR_HUB_URL}/api/v1/events/ToolInvocationRequested?payload.changes_committed_root=`,
        },

        brain: {
            c3prBrainUrl: C3PR_BRAIN_URL,
            c3prBrainPort: require('url').parse(C3PR_BRAIN_URL).port || 80,

            ChangesCommittedCallbackUrl:        `/callbacks/ChangesCommitted`,
            ToolInvocationCompletedCallbackUrl: `/callbacks/ToolInvocationCompleted`,
            PullRequestUpdatedCallbackUrl:      `/callbacks/PullRequestUpdated`,
        }
    }
};