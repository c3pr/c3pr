const config = require('../../config');
const githubClient = require('octonode').client(config.c3pr.gitHubApiToken);

function createForkIfNotExists(repoName) {
    const ghme = githubClient.me();
    return new Promise((resolve, reject) => {
        // noinspection JSUnusedLocalSymbols
        return ghme.fork(repoName, (err, data, headers) => {
            if (err) {
                reject(err);
            } else {
                resolve({
                    organization: data.owner.login,
                    cloneUrl: data.clone_url
                });
            }
        });
    });
}

module.exports = createForkIfNotExists;