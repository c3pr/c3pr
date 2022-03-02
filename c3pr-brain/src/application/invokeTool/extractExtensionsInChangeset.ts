const path = require('path');

/**
 * Expects:
 *
 * @param files e.g. ['src/main/a/b/c/Main.java', 'src/main/a/b/c/Main.js', 'src/main/a/b/c/Dockerfile']
 * @return Array<String> e.g. ['java', 'js', 'dockerfile']
 */
export function extractExtensionsInChangeset(files) {
    return distinct(files.map(extractExtension));
}

export function extractExtension(file) {
    return path.basename(file).split('.').pop().toLowerCase();
}

function distinct(a) {
    return Array.from(new Set(a));
}
