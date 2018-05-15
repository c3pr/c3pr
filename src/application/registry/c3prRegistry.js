const config = require('../../config');

let _registry = [
    {key: "registryUrl", value: config.c3pr.registryUrl, timeout: -1},
    {key: "mongoLogsUriIsSet", value: !!config.c3pr.mongoLogsUri, timeout: -1},
    {key: "mongoLogsDatabase", value: config.c3pr.mongoLogsDatabase, timeout: -1},
    {key: "mongoLogsCollection", value: config.c3pr.mongoLogsCollection, timeout: -1}
];

const c3prRegistry = {
    get registry() {
        return _registry.reduce((registryReturnObject, entry) => ({...registryReturnObject, [entry.key]: entry.value}), {});
    },
    get debug() {
        return [..._registry];
    },
    put(entryOrEntries) {
        let entries = Array.isArray(entryOrEntries) ? entryOrEntries : [entryOrEntries];

        entries.forEach(entry => {
            if (!entry.key || !entry.timeout || entry.value === undefined) {
                throw new Error("Entry must have a key, timeout and value. Received: " + JSON.stringify(entry));
            }
            _registry.push(Object.freeze(entry));
        });
    },
    cleanRegistryStepInMs: 2500
};

setInterval(() => {
    _registry = _registry.map(entry => {
        if (entry.timeout < 0) {
            return entry;
        }
        let newTimeout = entry.timeout - c3prRegistry.cleanRegistryStepInMs;
        if (newTimeout > 0) {
            return Object.freeze({...entry, timeout: newTimeout});
        } else {
            return null;
        }
    }).filter(e => e);
}, c3prRegistry.cleanRegistryStepInMs).unref();

module.exports = c3prRegistry;