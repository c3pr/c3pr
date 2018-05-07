const c3prLOG = require("node-c3pr-logger");
const axios = require('axios');
async function notifyC3prBotOfChanges(config, changes) {
    const logMeta = { nodeName: 'c3pr-repo-gitlab', correlationId: changes.meta && changes.meta.correlationId, moduleName: 'notifyC3prBotOfChanges' };
    if (!changes.meta ||
        !changes.meta.correlationId ||
        !changes.meta.compatibleSchemas ||
        !changes.meta.compatibleSchemas.includes("c3pr/c3pr::changes")) {
        const errorMessage = `SKIPPING: Request does not contain required metadata (meta.correlationId and meta.compatibleSchemas). Meta: ${JSON.stringify(changes.meta)}.`;
        c3prLOG(errorMessage, { changes }, logMeta);
        return;
    }
    try {
        c3prLOG(`Notifying ${config.c3pr.changesUrl} of changes to ${changes.repository.url}...`, logMeta);
        await axios.post(config.c3pr.changesUrl, changes);
        c3prLOG(`Notified ${config.c3pr.changesUrl} of changes to ${changes.repository.url}.`, { changes }, logMeta);
    }
    catch (e) {
        c3prLOG(`Error while notifying bot.
            * URL: ${config.c3pr.changesUrl}
            * Error:
            -----------------------\n
            ${require('util').inspect(e)}
            -----------------------\n\n`, logMeta);
    }
}
module.exports = notifyC3prBotOfChanges;
//# sourceMappingURL=notifyC3prBotOfChanges.js.map