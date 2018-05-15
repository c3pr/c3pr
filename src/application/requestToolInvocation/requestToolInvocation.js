const invokeTools = require('../../domain/invokeTools');

function requestToolInvocation(changesCommitted) {
    invokeTools(changesCommitted);
}

module.exports = {
    c3pr: {
        requestToolInvocation
    }
};