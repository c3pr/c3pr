const invokeTools = require('./invokeTools');

function requestToolInvocation(changesCommitted) {
    invokeTools(changesCommitted);
}

module.exports = {
    c3pr: {
        requestToolInvocation
    }
};