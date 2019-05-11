const config = require('../../config');
const client = require('../../infrastructure/db');

const logs = client.then(cli => cli.db(config.c3pr.hub.mongoC3prDatabase).collection(config.c3pr.hub.mongoLogsCollection));

export async function findLogsBy(query) {
    return (await logs).find(query).toArray();
}

export async function findAllLogsForEuuidGraph(euuid: any) {
    let logs = await findLogsBy({euuid});

    const queried = {
        lcids: new Set(),
        shas: new Set(),
        euuids: new Set()
    };
    queried.euuids.add(euuid);

    const allLogs = new LogSet();
    allLogs.addAll(logs);

    while (true) {
        let toQueryNow = {
            lcids: new Set(),
            shas: new Set(),
            euuids: new Set()
        };
        let needsToQuerySomething = false;
        logs.forEach(({lcid, sha, euuid}) => {
            if (!queried.lcids.has(lcid)) {
                toQueryNow.lcids.add(lcid);
                queried.lcids.add(lcid);
                needsToQuerySomething = true;
            }
            if (shouldNotExclude(sha) && !queried.shas.has(sha)) {
                toQueryNow.shas.add(sha);
                queried.shas.add(sha);
                needsToQuerySomething = true;
            }
            if (shouldNotExclude(euuid) && !queried.euuids.has(euuid)) {
                toQueryNow.euuids.add(euuid);
                queried.euuids.add(euuid);
                needsToQuerySomething = true;
            }
        });
        if (!needsToQuerySomething) {
            break;
        }

        let query = {
            $or: [
                {lcid: {$in: [...toQueryNow.lcids]}},
                {sha: {$in: [...toQueryNow.shas]}},
                {euuid: {$in: [...toQueryNow.euuids]}},
            ]
        };

        logs = await findLogsBy(query);
        allLogs.addAll(logs);
    }
    return logs;
}

class LogSet {
    private map: Map<string, any>;
    constructor() {
        this.map = new Map();
        this[Symbol.iterator] = this[Symbol.iterator].bind(this);
        this.addAll = this.addAll.bind(this);
        this.size = this.size.bind(this);
    }
    [Symbol.iterator]() {
        return this.map.values();
    }
    addAll(logs) {
        logs.forEach(log => {
            this.map.set(log._id.toString(), log);
        });
    }
    size() {
        return this.map.size;
    }
}

function shouldNotExclude(shaOrEuuid) {
    return !shaOrEuuid.startsWith('!') && !shaOrEuuid.includes('express')
}