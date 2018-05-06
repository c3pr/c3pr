
const rootTOKEN = 'MDz9-9zVPXJLun12angz'; // CHANGE ME!!!

const c3prGitlabURL = 'http://127.0.0.1:5004';

const axios = require('axios');
(async () => {

    let {data} = await axios.post(
        c3prGitlabURL + '/webhooks',
        {
            "url": "http://127.0.0.1:5004/hook",
            "push_events": true,
            "merge_requests_events": true,
        },
        {headers: {"PRIVATE-TOKEN": rootTOKEN}}
    );
    console.dir(data);

})().catch(e => {
    console.error('ERROR');
    console.error(e);
});