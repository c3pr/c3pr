const os = require("os");

const C3PR_HUB_URL = process.env.C3PR_HUB_URL || `http://${os.hostname()}:5000`;

const C3PR_BRAIN_URL = process.env.C3PR_BRAIN_URL || `http://${os.hostname()}:5001`;

module.exports = {
    c3pr: {
        jwt: null,

        registryUrl: process.env.C3PR_REGISTRY_URLx || `http://${os.hostname()}:5000/api/v1/registry`,

        hub: {
            c3prHubUrl: C3PR_HUB_URL,
            loginUrl: `${C3PR_HUB_URL}/api/v1/login`,
            ChangesCommittedUrl:        `${C3PR_HUB_URL}/api/v1/events/ChangesCommitted`,
            ToolInvocationCompletedUrl: `${C3PR_HUB_URL}/api/v1/events/ToolInvocationCompleted`,
            PullRequestUpdatedUrl:      `${C3PR_HUB_URL}/api/v1/events/PullRequestUpdated`,
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