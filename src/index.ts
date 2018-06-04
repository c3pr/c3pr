import inboundPorts from "./ports/inbound";

inboundPorts.c3prRepoGitLabLogin().then(() => {
    require('./adapters/inbound/web/express');
});
