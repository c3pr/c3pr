const config = require('./step2');

const axios = require('axios');

async function createUser(name, username, email) {
    console.log(`Creating: ${username}...`);
    let {data: createUserResponse} = await axios.post(
        config.gitlabUrl + '/api/v4/users',
        {email: email || `${username}@example.com`, username, name, reset_password: true},
        {headers: {"PRIVATE-TOKEN": config.rootAccessToken}}
    );
    console.info(`Successfully created ${username}. ID: ${createUserResponse.id}`);
    return createUserResponse.id;
}

(async () => {

    await createUser("C-3PR Bot", config.gitUserName, config.gitUserEmail);
    let userId = await createUser("Sample User", "sample_user");

    let {data} = await axios.post(
        config.gitlabUrl + '/api/v4/projects/user/' + userId, // creates for sample_user
        {name: 'sample-project-java-maven', import_url: 'https://github.com/c3pr/sample-project-java-maven.git', visibility: 'public'},
        {headers: {"PRIVATE-TOKEN": config.rootAccessToken}}
    );
    console.info(`Successfully created project with ID: ${data}.`);

/*
    // GROUPS
    let {data: groups} = await axios.get(
        config.gitlabUrl + '/api/v4/groups/',
        {headers: {"PRIVATE-TOKEN": config.rootAccessToken}}
    );
    console.log(groups);
    let {data: groupCreation} = await axios.post(
        config.gitlabUrl + '/api/v4/groups/',
        {name: 'c3pr', path: 'c3pr', visibility: 'public'},
        {headers: {"PRIVATE-TOKEN": config.rootAccessToken}}
    );
    let c3prGroupId = groupCreation.id;
    console.info(`Successfully created c3pr group with ID: ${c3prGroupId}.`);
    let {data: subgroupCreation} = await axios.post(
        config.gitlabUrl + '/api/v4/groups/',
        {name: 'forks', path: 'forks', visibility: 'public', parent_id: c3prGroupId},
        {headers: {"PRIVATE-TOKEN": config.rootAccessToken}}
    );
    console.info(`Successfully created c3pr/forks subgroup with ID: ${subgroupCreation.id}.`);
*/

})().catch(e => {
    console.error('ERROR');
    console.error(e);
});