const configForDemoScripts = require('./1 - config for demo scripts');

const jsonPost = require('./util/jsonPost');
const createGitLabUser = require('./util/createGitLabUser');

(async () => {

    let userId = await createGitLabUser("Sample User", "sample_user");

    let {data} = await jsonPost(
        configForDemoScripts.__gitlabUrl + '/api/v4/projects/user/' + userId, // creates for sample_user
        {name: 'sample-project-java-maven', import_url: 'https://github.com/c3pr/sample-project-java-maven.git', visibility: 'public'},
        {headers: {"PRIVATE-TOKEN": configForDemoScripts.__rootAccessToken}}
    );
    console.info(`Successfully created project with ID: ${data.id}.`, data);

/*
    // GROUPS
    let {data: groups} = await axios.get(
        configForDemoScripts.__gitlabUrl + '/api/v4/groups/',
        {headers: {"PRIVATE-TOKEN": configForDemoScripts.__rootAccessToken}}
    );
    console.log(groups);
    let {data: groupCreation} = await jsonPost(
        configForDemoScripts.__gitlabUrl + '/api/v4/groups/',
        {name: 'c3pr', path: 'c3pr', visibility: 'public'},
        {headers: {"PRIVATE-TOKEN": configForDemoScripts.__rootAccessToken}}
    );
    let c3prGroupId = groupCreation.id;
    console.info(`Successfully created c3pr group with ID: ${c3prGroupId}.`);
    let {data: subgroupCreation} = await jsonPost(
        configForDemoScripts.__gitlabUrl + '/api/v4/groups/',
        {name: 'forks', path: 'forks', visibility: 'public', parent_id: c3prGroupId},
        {headers: {"PRIVATE-TOKEN": configForDemoScripts.__rootAccessToken}}
    );
    console.info(`Successfully created c3pr/forks subgroup with ID: ${subgroupCreation.id}.`);
*/

})().catch(e => {
    console.error('ERROR');
    console.error(e);
});