const toolAgents = require('../toolAgents');
const invokeTools = require('../domain/invokeTools');
const log = require("node-c3pr-logger").log;

function handleChanges(changes) {
    log.info([changes.meta.correlationId], 'handleChanges', `Handling changes invoked for ${changes.repository.url} rev ${changes.repository.revision}...`);
    invokeTools(toolAgents, changes)
}

module.exports = handleChanges;