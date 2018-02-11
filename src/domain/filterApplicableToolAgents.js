const extractExtensionsInChangeset = require('./extractExtensionsInChangeset').extractExtensionsInChangeset;

function filterApplicableToolAgents(toolAgents, changes) {
    const extensionsInChangeset = extractExtensionsInChangeset(changes.changeset);

    let atLeastOneExtensionInChangesetIsIn = function (extensions) {
        return extensionsInChangeset.filter(extensionInChangeset => extensions.includes(extensionInChangeset)).length > 0;
    };

    return toolAgents.agents.filter(toolAgent => atLeastOneExtensionInChangesetIsIn(toolAgent.extensions));
}

module.exports = filterApplicableToolAgents;