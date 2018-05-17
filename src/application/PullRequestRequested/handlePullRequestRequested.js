const c3prLOG2 = require("node-c3pr-logger/c3prLOG2").c3pr.c3prLOG2;
const c3prCEAMAP = require('node-c3pr-hub-client/events/collectEventAndMarkAsProcessing').c3prCEAMAP;

const createGitLabMR = require('../pr/createGitLabMR');

const config = require('../../config');

const logMeta = {nodeName: 'c3pr-repo-gitlab', moduleName: 'handlePullRequestRequested'};

function handlePullRequestRequested() {
    c3prLOG2({msg: `Handling PullRequestRequested.`, logMetas: [logMeta]});

    c3prCEAMAP.collectEventAndMarkAsProcessing(
        {eventType: `PullRequestRequested`, c3prHubUrl: config.c3pr.hub.c3prHubUrl, jwt: config.c3pr.jwt, logMetas: [logMeta]}
    ).catch(() => {
        c3prLOG2({msg: `Couldn't collect PullRequestRequested. Skipping.`, logMetas: [logMeta]});
    }).then(async (pullRequestRequested) => {

        const prr = pullRequestRequested.payload;
        const repository = prr.repository;

        c3prLOG2({
            msg: `Handling MR request title '${prr.pr_title}' rev '${repository.revision}'`,
            logMetas: [logMeta],
            meta: {toolInvocationCompleted: pullRequestRequested}
        });

        /** @namespace prr.pr_body */
        /** @namespace prr.diff_base64 */
        /** @namespace prr.pr_title */
        await createGitLabMR({
            mainRepoOrgRepo: repository.fullpath,
            mainRepoBranch: repository.branch,
            mainRepoHash: repository.revision,
            gitLabUrl: config.c3pr.repoGitlab.gitlab.url,
            gitLabApiToken: config.c3pr.repoGitlab.gitlab.apiToken,
            gitUserName: config.c3pr.repoGitlab.gitlab.botUserName,
            gitUserEmail: config.c3pr.repoGitlab.gitlab.botUserEmail,
            prCommitMessage: prr.pr_title,
            prTitle: prr.pr_title,
            prBody: prr.pr_body,
            patchContent: prr.diff_base64
        });

        c3prLOG2({
            msg: `MR created successfully.`,
            logMetas: [logMeta],
            meta: {toolInvocationCompleted: pullRequestRequested}
        });
    });
}

module.exports = handlePullRequestRequested;