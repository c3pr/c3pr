//
/*
THIS SCRIPT CREATES THE WEBHOOK IN THE SAMPLE PROJECT.
 */
//
const configForDemoScripts = require('./1 - config for demo scripts');
const jsonPost = require('./util/jsonPost');

const C3PR_REPO_GITLAB_URL_FOR_GITLAB = `http://host.docker.internal:5004`;
(async () => {

    let {data} = await jsonPost(
        configForDemoScripts.__gitlabUrl + '/api/v4/projects/1/hooks',
        {
            "url": `${C3PR_REPO_GITLAB_URL_FOR_GITLAB}/webhooks`,
            "push_events": true,
            "merge_requests_events": true,
        },
        {headers: {"PRIVATE-TOKEN": configForDemoScripts.__gitLabApiToken}}
    );
    console.dir(data);

})().catch(e => {
    console.error('ERROR');
    console.error(e);
});