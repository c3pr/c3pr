const config = require('../../config');
const githubClient = require('octonode').client(config.c3pr.gitHubApiToken);

// https://github.com/pksunkara/octonode#create-a-pull-request-post-repospksunkarahubpulls
// https://developer.github.com/v3/pulls/#create-a-pull-request
function createPullRequest(mainRepoOrgRepo, mainRepoBranch, forkRepoOrg, forkRepoProject, forkRepoBranch, prTitle, prBodyMarkdown) {
    const ghrepo = githubClient.repo(mainRepoOrgRepo);
    return new Promise((resolve, reject) => {
        // noinspection JSUnusedLocalSymbols
        ghrepo.pr({
            "title": prTitle,
            "body": prBodyMarkdown,
            "head": `${forkRepoOrg}:${forkRepoBranch}`,
            "base": mainRepoBranch
        }, (err, data, headers) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

module.exports = createPullRequest;