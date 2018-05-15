const extractExtensionsInChangeset = require('./extractExtensionsInChangeset').extractExtensionsInChangeset;

function filterApplicableToolAgents(toolAgents, files) {
    const extensionsInChangeset = extractExtensionsInChangeset(files);

    let atLeastOneExtensionInChangesetIsIn = function (extensions) {
        return extensionsInChangeset.filter(extensionInChangeset => extensions.includes(extensionInChangeset)).length > 0;
    };

    return toolAgents.agents.filter(toolAgent => atLeastOneExtensionInChangesetIsIn(toolAgent.extensions));
}

module.exports = filterApplicableToolAgents;