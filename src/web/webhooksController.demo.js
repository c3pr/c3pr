let webhookPayload = {
    "object_kind": "push",
    "event_name": "push",
    "before": "5d296db9a2d2914d648945ae68303323b197de5b",
    "after": "71bb65bd5469805e3061de07552d0a2b933c5691",
    "ref": "refs/heads/master",
    "checkout_sha": "71bb65bd5469805e3061de07552d0a2b933c5691",
    "message": null,
    "user_id": 1,
    "user_name": "Administrator",
    "user_username": "root",
    "user_email": "admin@example.com",
    "user_avatar": "https://www.gravatar.com/avatar/e64c7d89f26bd1972efa854d13d7dd61?s=80&d=identicon",
    "project_id": 1,
    "project": {
        "id": 1,
        "name": "sample-project-java-maven",
        "description": null,
        "web_url": "http://d52b4bc956cd/sample_user/sample-project-java-maven",
        "avatar_url": null,
        "git_ssh_url": "git@d52b4bc956cd:sample_user/sample-project-java-maven.git",
        "git_http_url": "http://d52b4bc956cd/sample_user/sample-project-java-maven.git",
        "namespace": "sample_user",
        "visibility_level": 20,
        "path_with_namespace": "sample_user/sample-project-java-maven",
        "default_branch": "master",
        "ci_config_path": null,
        "homepage": "http://d52b4bc956cd/sample_user/sample-project-java-maven",
        "url": "git@d52b4bc956cd:sample_user/sample-project-java-maven.git",
        "ssh_url": "git@d52b4bc956cd:sample_user/sample-project-java-maven.git",
        "http_url": "http://d52b4bc956cd/sample_user/sample-project-java-maven.git"
    },
    "commits": [{
        "id": "71bb65bd5469805e3061de07552d0a2b933c5691",
        "message": "Update IssueUseStringEquals.java",
        "timestamp": "2018-05-09T01:29:44+00:00",
        "url": "http://d52b4bc956cd/sample_user/sample-project-java-maven/commit/71bb65bd5469805e3061de07552d0a2b933c5691",
        "author": {"name": "Administrator", "email": "admin@example.com"},
        "added": [],
        "modified": ["src/main/java/io/github/c3pr/sample/javamaven/walkmod/IssueUseStringEquals.java"],
        "removed": []
    }],
    "total_commits_count": 1,
    "repository": {
        "name": "sample-project-java-maven",
        "url": "git@d52b4bc956cd:sample_user/sample-project-java-maven.git",
        "description": null,
        "homepage": "http://d52b4bc956cd/sample_user/sample-project-java-maven",
        "git_http_url": "http://d52b4bc956cd/sample_user/sample-project-java-maven.git",
        "git_ssh_url": "git@d52b4bc956cd:sample_user/sample-project-java-maven.git",
        "visibility_level": 20
    }
};

const axios = require('axios');
const config = require('../config');

axios.post(config.c3pr.webhooksUrl, webhookPayload).then(response => {
    console.log('OK');
    console.log(response.data);
}).catch(response => {
    console.log('ERROR');
    console.log(response.data);
    console.log('\n\n\n\n');
    console.dir(response)
});