const config = require('./step2');

const axios = require('axios');
(async () => {

    let {data} = await axios.post(
        config.gitlabUrl + '/api/v4/projects/1/hooks',
        {
            "url": "http://c3prnginx:8045/webhooks",
            "push_events": true,
            "merge_requests_events": true,
        },
        {headers: {"PRIVATE-TOKEN": config.rootAccessToken}}
    );
    console.dir(data);

})().catch(e => {
    console.error('ERROR');
    console.error(e);
});