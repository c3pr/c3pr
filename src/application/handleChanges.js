const toolAgents = require('../toolAgents');
const invokeTools = require('../domain/invokeTools');

function handleChanges(changes) {
    console.log(`[${changes.meta.correlationId}] [handleChanges] >>> Handling changes invoked for ${changes.repository.url} rev ${changes.repository.revision}...`);
    invokeTools(toolAgents, changes)
}

module.exports = handleChanges;