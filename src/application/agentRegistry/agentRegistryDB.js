const client = require('../project/db');
const config = require('../../config');

const agentRegistryDB = client.then(cli => cli.db(config.c3pr.hub.mongoC3prDatabase).collection(config.c3pr.hub.mongoAgentRegistryCollection));

async function findBy(query) {
    return (await agentRegistryDB).find(query).toArray();
}

async function findAll() {
    return findBy({});
}

async function replaceOne(...a) {
    return (await agentRegistryDB).replaceOne(...a);
}

async function remove(query) {
    return (await agentRegistryDB).remove(query);
}

module.exports = {
    findAll,
    replaceOne,
    remove
};
