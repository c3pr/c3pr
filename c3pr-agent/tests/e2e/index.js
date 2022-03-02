require('./gen-tools');
const config = require('../../src/config');
config.c3pr.agent.agentToolsPath = `${__dirname}/tools`;
config.c3pr.agent.agentId = `FakeTxtTools`;
config.c3pr.agent.agentUrl = 'http://localhost:7499';
config.c3pr.agent.port = 7499;
require('../../src');