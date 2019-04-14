const extractExtensionsInChangeset = require('./extractExtensionsInChangeset').extractExtensionsInChangeset;

function atLeastOneExtensionInChangesetIsIn(extensionsInChangeset, extensions) {
    return extensionsInChangeset.filter(extensionInChangeset => extensions.includes(extensionInChangeset)).length > 0;
}

function filterApplicableToolAgents(toolAgents, files) {
    const extensionsInChangeset = extractExtensionsInChangeset(files);

    return toolAgents.filter(toolAgent => atLeastOneExtensionInChangesetIsIn(extensionsInChangeset, toolAgent.extensions));
}

export = filterApplicableToolAgents;