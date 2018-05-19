const http = require('http');
const https = require('https');

const URL = require('url');

function parse(str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return str;
    }
}

function jsonPost(postUrl, payload, options) {
    let cli = postUrl.startsWith("https") ? https : http;
    const urlObject = URL.parse(postUrl);
    const effectiveOptions = {
        hostname: urlObject.hostname,
        port: urlObject.port || (postUrl.startsWith("https") ? 443 : 80),
        path: urlObject.pathname,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', ...(options && options.headers || {})
        }
    };
    return new Promise((resolve, reject) => {
        let dataBuffer = '';
        let response = {};
        const req = cli.request(effectiveOptions, function (res) {
            response.status = res.statusCode;
            response.headers = res.headers;
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                dataBuffer += chunk;
            });
            res.on('end', () => {
                response.data = parse(dataBuffer);
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(response);
                } else {
                    reject(response);
                }
            });
        });
        req.on('error', function (e) {
            response.data = e.message;
            reject(response);
        });
        req.write(JSON.stringify(payload));
        req.end();
    });
}

module.exports = jsonPost;

// Example:
// jsonPost("https://reqres.in/api/users", {bob: "nelson1"}).then(s => console.log('SUCCESS.', s)).catch(e => console.error('ERROR.', e));