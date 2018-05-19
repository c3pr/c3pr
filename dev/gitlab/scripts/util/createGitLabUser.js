const configForDemoScripts = require('../1 - config for demo scripts');

const jsonPost = require('./jsonPost');

async function createGitLabUser(name, username, email) {
    console.log(`Creating: ${username}...`);
    let {data: createUserResponse} = await jsonPost(
        configForDemoScripts.__gitlabUrl + '/api/v4/users',
        {email: email || `${username}@example.com`, username, name, reset_password: true},
        {headers: {"PRIVATE-TOKEN": configForDemoScripts.__rootAccessToken}}
    );
    console.info(`Successfully created ${username}. ID: ${createUserResponse.id}`);
    return createUserResponse.id;
}

module.exports = createGitLabUser;



// noinspection JSUnusedLocalSymbols
function doTest() {
    const randomNumber = Math.floor(Math.random() * 99999999999) + 1;
    createGitLabUser("Sample User " + randomNumber, "sample_user" + randomNumber)
        .then(s => console.log('Success.', s))
        .catch(e => console.error('ERROR.', e));
}
//doTest();