
/**
 * Sorts an array of GitLab commits.
 * @param {Array} commits, unsorted.
 * @returns {Array} a different commits array, sorted.
 */
function sortCommits(commits) {
    const commitsClone = [...commits]; // clones before because .sort() sorts in place
    commitsClone.sort((a, b) => {
        return a.timestamp.localeCompare(b.timestamp);
    });
    return commitsClone;
}
module.exports = sortCommits;