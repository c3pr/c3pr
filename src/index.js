require('./application/events/events').init.then(() => {
    return require('./application/agentRegistry/agentRegistry').init;
}).then(() => {
    require('./web/express');
});