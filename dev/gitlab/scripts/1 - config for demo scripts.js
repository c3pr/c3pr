const c3prRepoGitlabConfig = require('../../../../c3pr-repo-gitlab/src/config');

module.exports = {
    __gitlabUrl: 'http://c3prgitlab:8888',
    __rootAccessToken: 'xEu3RquQyR53_sb-3yT-',
    __gitLabApiToken: 'TKbVFC57TM27HcVnqK55', // add this after script 3 (and creating a token manually afterwards)
    __botUserName: c3prRepoGitlabConfig.c3pr.repoGitlab.gitlab.botUserName,
    __botUserEmail: c3prRepoGitlabConfig.c3pr.repoGitlab.gitlab.botUserEmail,
};