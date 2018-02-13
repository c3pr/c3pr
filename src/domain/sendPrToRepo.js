const request = require('request');

function sendPrToRepo(prsUrl, pr) {
    const prefix = `[${pr.meta.correlationId}] [sendPrToRepo]`;
    console.log(`${prefix} Sending pr to repo ${prsUrl}... ${JSON.stringify(pr)}`);

    request.post(
        {
            url: prsUrl,
            json: true,
            body: pr
        },
        function (error, response, body) {
            if (error || response.statusCode !== 200) {
                console.log(`${prefix} Error while sending pr to repo.
                * URL: ${prsUrl}
                * Status: ${response.statusCode}
                * Error: ${error}
                * Body:
                -----------------------\n${body}
                -----------------------\n\n`);
            } else {
                console.log(`${prefix} Sent pr to repo at ${prsUrl}.`);
            }
        }
    );
}

module.exports = sendPrToRepo;