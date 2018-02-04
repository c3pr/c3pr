const githubClient = require('octonode').client(process.env.GITHUB_API_TOKEN);

function createForkIfNotExists(repoName) {
    const ghme = githubClient.me();
    return new Promise((resolve, reject) => {
        // noinspection JSUnusedLocalSymbols
        return ghme.fork(repoName, (err, data, headers) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

module.exports = createForkIfNotExists;