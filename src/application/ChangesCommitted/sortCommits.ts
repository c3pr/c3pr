import {Commit} from "../../ports/outbound/types/GitLabPush/GitLabPush";

/**
 * Sorts an array of GitLab commits.
 * @param commits the commits, unsorted.
 * @returns a different commits array, sorted.
 */
function sortCommits(commits: Commit[]): Commit[] {
    const commitsClone = [...commits]; // clones before because .sort() sorts in place
    commitsClone.sort((a, b) => {
        return a.timestamp.localeCompare(b.timestamp);
    });
    return commitsClone;
}
export { sortCommits };