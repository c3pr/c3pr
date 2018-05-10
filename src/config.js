const os = require("os");

const c3prBrainUrl = process.env.C3PR_BRAIN_URL || `http://${os.hostname()}:5001`;

module.exports = {
    c3pr: {
        registryUrl: process.env.C3PR_REGISTRY_URL || `http://${os.hostname()}:5000`,

        port: require('url').parse(c3prBrainUrl).port || 80,
        changesUrl: `${c3prBrainUrl}/changes`,
        patchesUrl: `${c3prBrainUrl}/patches`,
    }
};