const request = require('request');

const webhookRequestExample = require('./webhook/webhookRequestExample.json');

const config = require('../config');

config.c3pr.prsUrl = "http://localhost:5001/prs";

request.post(
    {
        url: 'http://localhost:5002/webhook',
        json: true,
        body: webhookRequestExample,
        headers: {
            'User-Agent': "GitHub-Hookshot/2e08413",
            'X-GitHub-Delivery': "beb147f6-0a71-11e8-837f-0a4e03c01e65",
            'X-GitHub-Event': "push",
            // 'X-Hub-Signature': "sha1=80ccdbdcb8469b7a943bd638a7c8edd27022fab8"
            'X-Hub-Signature': "sha1=cddfeb026c62783e375c47ad21f9d9e60e87477a"
        }
    },
    function (error, response, body) {
        if (error || response.statusCode !== 200) {
            console.log(`ERROR:
                
                * Status: ${(response || {}).statusCode}
                * Error: ${error}
                * Body:
                -----------------------
                ${JSON.stringify(body, null, 2)}
                -----------------------\n
            `);
        } else {
            console.log(`Sent pr to repo successfully.`);
        }
    }
);
