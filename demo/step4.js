//
/*
THIS ONE CREATES THE WEBHOOK IN THE SAMPLE PROJECT.
 */
const config = require('./step2');

const axios = require('axios');
(async () => {

    let {data} = await axios.post(
        config.gitlabUrl + '/api/v4/projects/1/hooks',
        {
            "url": "http://host.docker.internal:5004/webhooks",
            "push_events": true,
            "merge_requests_events": true,
        },
        {headers: {"PRIVATE-TOKEN": config.gitLabApiToken}}
    );
    console.dir(data);

})().catch(e => {
    console.error('ERROR');
    console.error(e);
});