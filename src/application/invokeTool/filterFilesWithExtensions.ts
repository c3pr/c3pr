const extractExtension = require("./extractExtensionsInChangeset").extractExtension;

function filterFilesWithExtensions(changeset, extensions) {
    return changeset.filter(file => extensions.includes(extractExtension(file)));
}

export = filterFilesWithExtensions;