const login = require('./index').c3prHubClient.login;

login({
    loginUrl: 'http://127.0.0.1:5000/api/v1/login',
    logMetas: [],
    subscriptions: []
})
    .then(s => console.log(s))
    .catch(e => console.log('Error', e));