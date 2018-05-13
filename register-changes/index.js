const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;

const axios = require('axios');

async function registerChanges(changes, {changesUrl, jwt, logMetas: outerLogMetas}) {
    const logMeta = {nodeName: 'node-c3pr-repo', correlationId: changes.meta && changes.meta.correlationId, moduleName: 'notifyC3prBotOfChanges'};
    const logMetas = [...(outerLogMetas || []), logMeta];

    try {
        c3prLOG2({msg: `Notifying HUB (${changesUrl}) of changes to ${changes.repository.url}...`, logMetas});

        await axios.post(changesUrl, {headers: {Authentication: `Bearer ${jwt}`}}, changes);

        c3prLOG2({msg: `Notified HUB (${changesUrl}) of changes to ${changes.repository.url}.`, logMetas});
    } catch (e) {
        c3prLOG2({
            msg: `Error while notifying bot at ${changesUrl}. Reason: '${e}'.`,
            logMetas,
            meta: {error: require('util').inspect(e)}
        });
    }
}

module.exports = {
    c3pr: {
        registerChanges
    }
};