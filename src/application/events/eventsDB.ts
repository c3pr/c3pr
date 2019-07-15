import dbClient from "../../infrastructure/dbClient";
import config from "../../config";
import {MongoClient} from "mongodb";
import * as assert from "assert";
import utils from "../../infrastructure/utils";

const UNPROCESSED = 'UNPROCESSED';
const PROCESSING = 'PROCESSING';
const PROCESSED = 'PROCESSED';
export const Status = Object.freeze({
    [UNPROCESSED]: UNPROCESSED,
    [PROCESSING]: PROCESSING,
    [PROCESSED]: PROCESSED
});

let dbClientConnected: Promise<MongoClient>;

const events = () => (async () => {
    if (dbClientConnected === undefined) {
        console.log('Connecting EventsDB');
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
    return (await events()).find(query).sort({'meta.created': 1, 'timestamp': 1}).toArray();
}

function findAllOfType(event_type, query) {
    return findAll({event_type, ...query});
}

async function close() {
    return (await dbClientConnected).close();
}

function registerNewEventAsProcessed(event_type, payload) {
    assert.ok(event_type && payload, "Missing required arguments");
    let uuid = utils.uuid();

    const now = new Date().toISOString();
    return insert({uuid, event_type, meta: {status: Status.PROCESSED, processor_uuid: 'c3pr-brain', created: now, modified: now}, payload});
}

export default {
    registerNewEventAsProcessed,
    find,
    findAll,
    findAllOfType,
    close,
};