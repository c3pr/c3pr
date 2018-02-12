const os = require("os");
const PORT = process.env.PORT || 5001;

const c3prBaseUrl = process.env.C3PR_C3PR_URL || `http://${os.hostname()}:${PORT}`;

module.exports = {
    c3pr: {
        port: PORT,
        changesUrl: `${c3prBaseUrl}/changes`,
        patchesUrl: `${c3prBaseUrl}/patches`
    }
};