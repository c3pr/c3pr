const os = require("os");
const PORT = process.env.PORT || 5001;

const c3prBrainUrl = process.env.C3PR_BRAIN_URL || `http://${os.hostname()}:${PORT}`;

module.exports = {
    c3pr: {
        port: PORT,
        changesUrl: `${c3prBrainUrl}/changes`,
        patchesUrl: `${c3prBrainUrl}/patches`
    }
};