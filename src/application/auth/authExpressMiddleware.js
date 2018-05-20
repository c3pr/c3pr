const decodeToken = require("./auth").decodeToken;

function authExpressMiddleware(request, response, next) {
    if (!request.headers.authorization || request.headers.authorization.split(' ')[0] !== 'Bearer') {
        response.status(401).send(`Please send a "Authorization: Bearer TOKEN-JWT" header.`);
    } else {
        try {
            request.decodedJwtToken = decodeToken(request.headers.authorization.split(' ')[1]);
            next();
        } catch (e) {
            let errorStatus = (e.toString() === 'Error: Signature verification failed') ? 401 : 500;
            response.status(errorStatus).send(e.toString());
        }
    }
}

module.exports = authExpressMiddleware;