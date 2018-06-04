import inboundPorts from "./ports/inbound";

inboundPorts.c3prRepoGitLabLogin().then(() => {
    require('./ports/inbound/adapters/web/express');
});
