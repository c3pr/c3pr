const login = require('./index').default;

login({
    loginUrl: 'http://127.0.0.1:7300/api/v1/login',
    username: 'username',
    password: 'password',
    subscriptions: []
}, console.log)
    .then(s => console.log(s))
    .catch(e => console.log('Error', e));