const os = require("os");
const hubClientConfig = require('node-c3pr-hub-client').hubClientConfig;

const C3PR_HUB_URL = process.env.C3PR_HUB_URL || `http://${os.hostname()}:7300`;

const C3PR_BRAIN_URL = process.env.C3PR_BRAIN_URL || `http://${os.hostname()}:7301`;

const C3PR_MONGO_URL = process.env.C3PR_MONGO_URL || 'mongodb://127.0.0.1:27017';
const C3PR_MONGO_DATABASE = process.env.C3PR_MONGO_DATABASE || 'c3pr';

const config = {
    c3pr: {
        auth: {
            jwt: null,
        },

        hub: {
            c3prHubUrl: C3PR_HUB_URL,
            loginUrl: `${C3PR_HUB_URL}/api/v1/login`,

            agentsUrl: `${C3PR_HUB_URL}/api/v1/agents`,
        },

        brain: {
            c3prBrainUrl: C3PR_BRAIN_URL,
            c3prBrainPort: require('url').parse(C3PR_BRAIN_URL).port || 7301,

            mongoC3prUrl: C3PR_MONGO_URL,
            mongoC3prDatabase: C3PR_MONGO_DATABASE,
            mongoEventsCollection: 'events',

            ChangesCommittedCallbackUrl:        `/callbacks/ChangesCommitted`,
            ToolInvocationCompletedCallbackUrl: `/callbacks/ToolInvocationCompleted`,
            PullRequestCreatedCallbackUrl:      `/callbacks/PullRequestCreated`,
            PullRequestUpdatedCallbackUrl:      `/callbacks/PullRequestUpdated`
        }
    }
};

hubClientConfig.init(C3PR_HUB_URL, () => config.c3pr.auth.jwt);

export default config;