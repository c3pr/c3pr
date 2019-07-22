import * as path from "path";
import * as eventsDBModule from "../../src/application/events/eventsDB";

function resolve(path, obj = self, separator = '.') {
    const properties = Array.isArray(path) ? path : path.split(separator);
    return properties.reduce((prev, curr) => prev && prev[curr], obj)
}

const eventsDBFakeOptions: EventsDBFakeOptions = {
    cutTime: "2030-01-01T00:00:00.000Z",
    events: null
};
function fetchEvents(eventsOption: any[] | string): any[] {
    if (!eventsOption){
        return fetchEvents('eventsDBFake.data.json');
    } else if (typeof eventsOption === "string") {
        return require(path.resolve(__dirname, eventsOption));
    } else {
        return eventsOption;
    }
}

async function findAll(query) {
    let events = fetchEvents(eventsDBFakeOptions.events);
    return events.filter(e => {
        if (eventsDBFakeOptions.cutTime && e.meta.created > eventsDBFakeOptions.cutTime) {
            return false;
        }
        for (const key of Object.keys(query)) {
            if (query[key] !== resolve(key, e)) return false;
        }
        return true;
    });
}

eventsDBModule.default.find = async (uuid) => (await findAll({uuid}))[0];
eventsDBModule.default.findAll = findAll;
console.log('eventsDBFake loaded.');

interface EventsDBFakeOptions {
    cutTime?: string;
    events?: any[] | string;
}

export default function setOptions(options: EventsDBFakeOptions) {
    if (options.cutTime) eventsDBFakeOptions.cutTime = options.cutTime;
    if (options.events) eventsDBFakeOptions.events = options.events;
}