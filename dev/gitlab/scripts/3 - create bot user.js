const configForDemoScripts = require('./1 - config for demo scripts');

const createGitLabUser = require('./util/createGitLabUser');

createGitLabUser("C-3PR Bot", configForDemoScripts.__botUserName, configForDemoScripts.__botUserEmail)
    .then(s => console.log('Success.', s))
    .catch(e => console.error('ERROR.',e));