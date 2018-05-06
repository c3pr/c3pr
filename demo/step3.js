const config = require('./step2');

const axios = require('axios');
(async () => {

    async function createUser(name, username) {
        console.log(`Creating: ${username}...`);
        let {data: createUserResponse} = await axios.post(
            config.gitlabUrl + '/api/v4/users',
            {email: `${username}@example.com`, username, name, reset_password: true},
            {headers: {"PRIVATE-TOKEN": config.rootAccessToken}}
        );
        console.info(`Successfully created ${username}. ID: ${createUserResponse.id}`);
        return createUserResponse.id;
    }
    let userId = await createUser("Sample Userx", "sample_user");

    let {data} = axios.post(
        config.gitlabUrl + '/api/v4/projects/user/' + userId, // creates for sample_user
        {name: 'sample-project-java-maven', import_url: 'https://github.com/c3pr/sample-project-java-maven.git', visibility: 'public'},
        {headers: {"PRIVATE-TOKEN": config.rootAccessToken}}
    );
    console.info(`Successfully created project with ID: ${data}.`);

})().catch(e => {
    console.error('ERROR');
    console.error(e);
});