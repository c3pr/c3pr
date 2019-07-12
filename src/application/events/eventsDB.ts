import dbClient from "../../infrastructure/dbClient";
import config from "../../config";
import {MongoClient} from "mongodb";

let dbClientConnected: Promise<MongoClient>;

const events = () => (async () => {
    if (dbClientConnected === undefined) {
        console.log('Connecting EventsDB');
        throw Error("x");
        dbClientConnected = dbClient();
    }
    return (await dbClientConnected).db(config.c3pr.brain.mongoC3prDatabase).collection(config.c3pr.brain.mongoEventsCollection);
})();

async function insert(e) {
    return (await events()).insertOne(e);
}

async function find(uuid) {
    return (await events()).findOne({uuid});
}

async function findAll(query = {}) {
    return (await events()).find(query).toArray();
}

function findAllOfType(event_type, query) {
    return findAll({event_type, ...query});
}

async function close() {
    return (await dbClientConnected).close();
}

export default {
    insert,
    find,
    findAll,
    findAllOfType,
    close,
};