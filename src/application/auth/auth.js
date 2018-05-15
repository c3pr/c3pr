const jwt = require('jwt-simple');
const uuidv4 = require('uuid/v4');

let secret = Buffer.from(uuidv4(), 'hex');

function encodeToken(payload) {
    return jwt.encode(payload, secret);
}
function encodeUuidToken() {
    return encodeToken({
        sub: uuidv4(),
        iss: 'c3pr-hub',
        permissions: 'register-events'
    });
}
function decodeToken(token) {
    return jwt.decode(token, secret);
}

module.exports = {
    encodeUuidToken,
    decodeToken
};