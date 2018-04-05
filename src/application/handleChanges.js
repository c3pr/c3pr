const toolAgents = require('../toolAgents');
const invokeTools = require('../domain/invokeTools');
const c3prLOG = require("node-c3pr-logger");

function handleChanges(changes) {
    c3prLOG('c3pr', [changes.meta.correlationId], 'handleChanges', `Handling changes invoked for ${changes.repository.url} rev ${changes.repository.revision}...`);
    invokeTools(toolAgents, changes)
}

module.exports = handleChanges;