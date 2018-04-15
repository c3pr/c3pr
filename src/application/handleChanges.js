const toolAgents = require('../toolAgents');
const invokeTools = require('../domain/invokeTools');
const c3prLOG = require("node-c3pr-logger");

function handleChanges(changes) {
    c3prLOG(`Handling changes invoked for ${changes.repository.url} rev ${changes.repository.revision}...`, {nodeName: 'c3pr-brain', correlationId: changes.meta.correlationId, moduleName: 'handleChanges'});
    invokeTools(toolAgents, changes)
}

module.exports = handleChanges;