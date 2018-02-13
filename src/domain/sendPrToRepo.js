const request = require('request');

function sendPrToRepo(prUrl, pr) {
    const prefix = `[${pr.meta.correlationId}] [sendPrToRepo]`;
    console.log(`${prefix} Sending pr to repo ${prUrl}... ${JSON.stringify(pr)}`);

    request.post(
        {
            url: prUrl,
            json: true,
            body: pr
        },
        function (error, response, body) {
            if (error || response.statusCode !== 200) {
                console.log(`${prefix} Error while sending pr to repo.
                * URL: ${prUrl}
                * Status: ${response.statusCode}
                * Error: ${error}
                * Body:
                -----------------------\n${body}
                -----------------------\n\n`);
            } else {
                console.log(`${prefix} Sent pr to repo at ${prUrl}.`);
            }
        }
    );
}

module.exports = sendPrToRepo;