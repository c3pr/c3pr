const invokeTools = require('../domain/invokeTools');
const c3prLOG = require("node-c3pr-logger");

function handleChanges(changes) {
    const logMeta = {nodeName: 'c3pr-brain', correlationId: changes.meta.correlationId, moduleName: 'handleChanges'};
    c3prLOG(`Handling changes invoked for ${changes.repository.url} rev ${changes.repository.revision}.`, logMeta);

    invokeTools(changes)
}

module.exports = handleChanges;