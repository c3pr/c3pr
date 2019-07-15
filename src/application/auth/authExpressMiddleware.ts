const decodeToken = require("./auth").decodeToken;

function authExpressMiddleware(request, response, next) {
    // noinspection UnreachableCodeJS
    if (false /* disable login for now */ && (!request.headers.authorization || request.headers.authorization.split(' ')[0] !== 'Bearer')) {
        response.status(401).send(`Please send a "Authorization: Bearer TOKEN-JWT" header.`);
    } else {
        try {
            Object.defineProperty(request, 'decodedJwtToken', {
                get: () => decodeToken(request.headers.authorization.split(' ')[1])
            });
            next();
        } catch (e) {
            let errorStatus = (e.toString() === 'Error: Signature verification failed') ? 401 : 500;
            response.status(errorStatus).send('Error while decoding JWT Token of Authorization header "'+request.headers.authorization+'". ' + e.toString());
        }
    }
}

export = authExpressMiddleware;