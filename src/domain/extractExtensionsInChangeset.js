const path = require('path');

/**
 * Expects:
 *
 * @param changeset e.g. ['src/main/a/b/c/Main.java', 'src/main/a/b/c/Main.js', 'src/main/a/b/c/Dockerfile']
 * @return Array<String> e.g. ['java', 'js', 'dockerfile']
 */
function extractExtensionsInChangeset(changeset) {
    return distinct(changeset.map(extractExtension));
}

function extractExtension(file) {
    return path.basename(file).split('.').pop().toLowerCase();
}

function distinct(a) {
    return Array.from(new Set(a));
}

module.exports = extractExtensionsInChangeset;