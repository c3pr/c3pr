const os = require("os");

const C3PR_HUB_URL = process.env.C3PR_HUB_URL || `http://${os.hostname()}:5000`;

const c3prBrainUrl = process.env.C3PR_BRAIN_URL || `http://${os.hostname()}:5001`;

module.exports = {
    c3pr: {
        jwt: null,

        registryUrl: process.env.C3PR_REGISTRY_URLx || `http://${os.hostname()}:5000/api/v1/registry`,

        port: require('url').parse(c3prBrainUrl).port || 80,

        brain: {
            changesCallbackUrl: `${c3prBrainUrl}/callbacks/changes`,
            completeToolInvocationCallbackUrl: `${c3prBrainUrl}/callbacks/complete-tool-invocation`,
            patchCallbackUrl: `${c3prBrainUrl}/callbacks/patch`,
        },

        hub: {
            c3prHubUrl: C3PR_HUB_URL,
            loginUrl: `${C3PR_HUB_URL}/api/v1/login`,
            changesUrl: `${C3PR_HUB_URL}/api/v1/events/changes`,
        }
    }
};