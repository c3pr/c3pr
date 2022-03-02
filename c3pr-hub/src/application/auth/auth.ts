const jwt = require('jwt-simple');
const uuidv4 = require('uuid/v4');

let secret = Buffer.from(uuidv4(), 'hex');

function encodeToken(payload) {
    return jwt.encode(payload, secret);
}
function encodeUuidToken(sub) {
    return encodeToken({
        sub,
        iss: 'c3pr-hub',
        permissions: 'anything'
    });
}
function decodeToken(token) {
    return jwt.decode(token, secret);
}

export { encodeUuidToken, decodeToken };